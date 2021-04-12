// validators are in route files
const { validationResult } = require('express-validator');

const Subscriber = require('../models/subscriber');
const path = require('path');
const sgMail = require('@sendgrid/mail');
const cryptoRandomString = require('crypto-random-string');
const errorTemplate = require('../views/error');

sgMail.setApiKey(process.env.SGMAIL);

// To send email with contact form
module.exports.postContact = async (req, res) => {
    const { fullName, email, message } = req.body

    try {
        const validationErrors = validationResult(req);
        // checking for errors as well as if characters were escaped before sending email
        if (validationErrors.errors.length > 0) {
            res.send(validationErrors)
        } else {
            const body = {
                to: 'lerouxvermeulen@gmail.com',
                // put authenticated sendgrid email here
                from: 'New.Customer.Contact@gmail.com',
                subject: `New email inquiry from ${fullName}`,
                html: `<p>${message}.</p><p style="color: #A9A9A9">From: <i>${email}</i></p>`
            }
            const response = await sgMail.send(body)
            res.send(response);
        }
    } catch (e) {
        res.send({ error: e });
    }

}

// To add a subscriber
module.exports.postSubscriber = async (req, res) => {
    try {
        const validationErrors = validationResult(req);
        if (validationErrors.errors.length > 0) {
            res.send(validationErrors)
        } else {
            const foundSub = await Subscriber.findOne({ email: req.body.email });
            if (!(foundSub)) {
                let firstName = req.body.firstName;
                let email = req.body.email;
                let token = cryptoRandomString({ length: 10, type: 'alphanumeric' });
                const newSub = new Subscriber({ firstName: firstName, email: email, token: token });
                await newSub.save();
                res.send(newSub);
            } else {
                res.send({ alreadySub: "You are already a subscriber." });
            }
        }
    } catch (e) {
        res.send({ error: e.message });
    }

};

// Delete a subscriber
module.exports.deleteSubscriber = async (req, res) => {
    try {
        // delete subscriber from db on click unsubscribe
        const deleted = await Subscriber.findOneAndDelete({ token: req.params.token });
        res.sendFile(path.join(__dirname, '../views/unsubscribed.html'));
    } catch (e) {
        res.send(errorTemplate({ error: e }));
    }
}