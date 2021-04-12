const MenuItem = require('../models/menu');
const { cloudinary } = require('../cloudinary');
const { validationResult } = require('express-validator');

// Get all menu items
module.exports.getMenu = async (req, res) => {
    try {
        // making sure newest added items are first in queue
        const menuItems = await MenuItem.find({});
        res.send(menuItems);
    } catch (e) {
        // log error for dev purposes
        // if couldnt find events, send message to front end
        res.send({ error: `Something went wrong: <br> Could not find menu items.` });
    }

}

// Post a menu item
module.exports.postMenuItem = async (req, res) => {
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
            if ((!(errors.includes('menuImage'))) && (errors.includes('menuItemName') || errors.includes('menuItemPrice') || errors.includes('menuItemDescription'))) {
                await cloudinary.uploader.destroy(req.file.filename);
            }

            res.send(validationErrors)
        } else {
            const newMenuItem = new MenuItem(req.body);
            newMenuItem.menuImageUrl = req.file.path;
            newMenuItem.menuImageName = req.file.filename;
            const saved = await newMenuItem.save();
            res.send(saved);
        }
    } catch (e) {
        res.send({ error: e });
    }
}

// Update a menu item
module.exports.updateMenuItem = async (req, res) => {
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
            let updatedMenuItem = await MenuItem.findById({ _id });
            // Set updated properties
            updatedMenuItem.menuItemName = req.body.menuItemName;
            updatedMenuItem.menuItemPrice = req.body.menuItemPrice;
            updatedMenuItem.menuItemDescription = req.body.menuItemDescription;

            // Set name and url of new image if any
            if (req.file) {
                // delete old image from cloudinary
                await cloudinary.uploader.destroy(updatedMenuItem.menuImageName);
                updatedMenuItem.menuImageUrl = req.file.path;
                updatedMenuItem.menuImageName = req.file.filename;
            }
            // Save updated to db
            updatedMenuItem.save();
            // send updated to front end
            res.send(updatedMenuItem);
        }
    } catch (e) {
        res.send({ error: e });
    }
}

// Delete a menu item
module.exports.deleteMenuItem = async (req, res) => {
    try {
        // finding and deleting that menu item with id and saving it to a variable
        const deleted = await MenuItem.findOneAndDelete({ _id: req.body.id });
        // setting the filename to be the filename that was on deleted item
        let filename = deleted.menuImageName;
        // using filename to delete the image from cloudinary
        await cloudinary.uploader.destroy(filename);
        res.send(deleted);
    } catch (e) {
        res.send({ error: e });
    }
}