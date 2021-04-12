const Event = require('../models/event');
const Subscriber = require('../models/subscriber');
const sgMail = require('@sendgrid/mail');
const { cloudinary } = require('../cloudinary');
const { validationResult } = require('express-validator');

sgMail.setApiKey('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');

// Get all events
module.exports.getEvents = async (req, res) => {
    try {
        const events = await Event.find({});
        res.send(events);
    } catch (e) {
        // if couldnt find events, send message to front end
        res.send({ error: `Something went wrong: <br> Could not find events.` });
    }

};

// Add an event
module.exports.postEvent = async (req, res) => {
    try {
        // Validation and sanitization
        const validationErrors = validationResult(req);

        if (validationErrors.errors.length > 0) {
            let errors = [];
            for (let error of validationErrors.errors) {
                errors.push(error.param)
            }
            // if there are other errors but not menuImage errors
            // it means an image has been uploaded, so delete it
            if ((!(errors.includes('eventImage'))) && (errors.includes('eventName') || errors.includes('eventDate') || errors.includes('eventLocation'))) {
                await cloudinary.uploader.destroy(req.file.filename);
            }
            res.send(validationErrors)

        } else {
            const newEvent = new Event(req.body);
            newEvent.eventImageUrl = req.file.path;
            newEvent.eventImageName = req.file.filename;
            const saved = await newEvent.save();

            // Find all subscribers from DB
            const subscribers = await Subscriber.find({});
            // for each subscriber, send an email, with the correct "to:" correct name,
            // and correct email and token embedded in the unsubscribe link
            if (subscribers.length >= 1) {
                for (let subscriber of subscribers) {
                    const message = {
                        // To all users from the database
                        to: subscriber.email,
                        // put authenticated sendgrid email here
                        from: 'Nomadcafesa@gmail.com',
                        subject: `New Upcoming Event from Nomad Cafe`,
                        // Have API endpoint that deals with unsubscribing a subscriber
                        html: `<h3>Good day ${subscriber.firstName}</h3><p style="margin-bottom: 8px">We will be attending the following event:</p><p style="margin-bottom: 3px">Event Name: "${saved.eventName}"</p><p style="margin-bottom: 3px">Event Location: "${saved.eventLocation}"</p><p style="margin-bottom: 3px">Event Date: "${saved.eventDate}"</p><p style="color: #A9A9A9">Click <a href="http://localhost:3000/subscriber/delete/${subscriber.token}"><i>here</i></a> to unsubscribe</p>`
                    }
                    // Sending mail
                    await sgMail.send(message)
                }
            }
            res.send(saved);
        }
        // Catching error of any async operation here
    } catch (e) {
        // sending error message through to flash on front end
        res.send({ error: e.message });
    }
};

// Update event
module.exports.updateEvent = async (req, res) => {
    try {
        // Validation and sanitization
        const validationErrors = validationResult(req);
        if (validationErrors.errors.length > 0) {
            // if there are errors, also check if a file was uploaded.
            // if so, delete it.
            if (req.file) {
                await cloudinary.uploader.destroy(req.file.filename);
            }
            res.send(validationErrors)

        } else {
            // Save id of item that was clicked on
            let _id = req.body.id;
            // find item in db based on that id
            let updatedEvent = await Event.findById({ _id });
            // Set updated properties
            updatedEvent.eventName = req.body.eventName;
            updatedEvent.eventDate = req.body.eventDate;
            updatedEvent.eventLocation = req.body.eventLocation;

            // Set name and url of new image if any
            if (req.file) {
                // delete old image from cloudinary
                await cloudinary.uploader.destroy(updatedEvent.eventImageName);
                updatedEvent.eventImageUrl = req.file.path;
                updatedEvent.eventImageName = req.file.filename;
            }
            // Save updated to db
            updatedEvent.save();
            // Find all subscribers from DB
            const subscribers = await Subscriber.find({});
            if (subscribers.length >= 1) {
                for (let subscriber of subscribers) {
                    const message = {
                        // To all users from the database
                        to: subscriber.email,
                        // put authenticated sendgrid email here
                        from: 'Nomadcafesa@gmail.com',
                        subject: `An Events Details Has Been Updated`,
                        // Have API endpoint that deals with unsubscribing a subscriber
                        html: `<h2>Good day ${subscriber.firstName}</h2><p style="margin-bottom: 8px">The updated events new details are:</p><p style="margin-bottom: 2px">Event Name: "${updatedEvent.eventName}"</p><p style="margin-bottom: 2px">Event Location: "${updatedEvent.eventLocation}"</p><p style="margin-bottom: 2px">Event Date: "${updatedEvent.eventDate}"</p><p style="color: #A9A9A9">Click <a href="http://localhost:3000/subscriber/delete/${subscriber.token}"><i>here</i></a> to unsubscribe</p>`
                    }
                    await sgMail.send(message)
                }
            }
            // send updated to front end
            res.send(updatedEvent);
        }
    } catch (e) {
        res.send({error: e})
    }
}

// Delete event
module.exports.deleteEvent = async (req, res) => {
    try {
        // finding and deleting that menu item with id and saving it to a variable
        const deleted = await Event.findOneAndDelete({ _id: req.body.id });
        // setting the filename to be the filename that was on deleted item
        let filename = deleted.eventImageName;
        // using filename to delete the image from cloudinary
        await cloudinary.uploader.destroy(filename);

        // Find all subscribers from DB
        const subscribers = await Subscriber.find({});
        // for each subscriber, send an email, with the correct "to:" correct name,
        // and correct email and token embedded in the unsubscribe link
        if (subscribers.length >= 1) {
            for (let subscriber of subscribers) {
                const message = {
                    // To all users from the database
                    to: subscriber.email,
                    // put authenticated sendgrid email here
                    from: 'Nomadcafesa@gmail.com',
                    subject: `An Event Has Been Canceled`,
                    // Have API endpoint that deals with unsubscribing a subscriber
                    html: `<h2>Good day ${subscriber.firstName}</h2><p style="margin-bottom: 8px">Unfortunately, we will not be attending the following event any longer:</p><p style="margin-bottom: 3px">Event Name:"${deleted.eventName}"</p><p style="margin-bottom: 3px">Event Date:"${deleted.eventDate}"</p><p style="margin-bottom: 3px">Event Location:"${deleted.eventLocation}"</p><p style="color: #A9A9A9">Click <a href="http://localhost:3000/subscriber/delete/${subscriber.token}"><i>here</i></a> to unsubscribe</p>`
                }
                await sgMail.send(message)
            };
        }
        res.send(deleted);
    } catch (e) {
        res.send({ error: e });
    }
}