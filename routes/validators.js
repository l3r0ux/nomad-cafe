// THERE ARE CLIENT SIDE VALIDATIONS ON FRONT END HTML, BUT MUST ALSO VALIDATE AND SANITIZE ON BACK END
const { check } = require('express-validator');
const bcrypt = require('bcrypt');
const Admin = require('../models/admin');
const path = require('path');

module.exports = {
    // Contact and Susbcribe validation and sanitization
    checkFullName: check('fullName')
        // Checking that its not empty, escaping and then checking if it escaped anything
        .escape()
        .custom((fullName) => {
            if (fullName.includes(';')) {
                throw new Error("&bull;Not Allowed");
            } else {
                return true;
            }
        }).bail()
        .notEmpty().withMessage('&bull;Please Provide Your Full Name.')
        .trim(),
    checkMessage: check('message')
        .notEmpty().withMessage('&bull;Please Provide a Message.').bail()
        .escape()
        .custom((message) => {
            if (message.includes(';')) {
                throw new Error("&bull;Not Allowed");
            } else {
                return true;
            }
        }).bail()
        .trim(),
    checkEmail: check('email')
        .escape()
        .custom((email) => {
            if (email.includes(';')) {
                throw new Error("&bull;Not Allowed");
            } else {
                return true;
            }
        })
        .notEmpty().withMessage('&bull;Please Provide Your Email.').bail()
        .trim()
        .normalizeEmail()
        .isEmail().withMessage('&bull;Must be a Valid Email Address.').bail(),
    checkFirstName: check('firstName')
        .escape()
        .custom((firstName) => {
            if (firstName.includes(';')) {
                throw new Error("&bull;Not Allowed");
            } else {
                return true;
            }
        })
        .notEmpty().withMessage('&bull;Please Provide Your First Name.').bail()
        .trim(),

    // Menu Forms validation and sanitization
    checkItemFile: check('menuImage')
        .custom((menuImage, { req }) => {
            if (!(req.file)) {
                throw new Error('&bull;Please Choose a File.');
            } else {
                let extension = (path.extname(req.file.originalname)).toLowerCase();
                switch (extension) {
                    case '.jpg':
                        return '.jpg';
                    case '.jpeg':
                        return '.jpeg';
                    case '.png':
                        return '.png';
                    default:
                        return false;
                }
            }
        }),
    checkItemName: check('menuItemName')
        .escape()
        .notEmpty().withMessage('&bull;Please Enter an Item Name.').bail()
        .custom((menuItemName) => {
            if (menuItemName.includes(';')) {
                throw new Error("&bull;Not Allowed");
            } else {
                return true;
            }
        }).bail()
        .trim(),
    checkItemPrice: check('menuItemPrice')
        .escape()
        .custom((menuItemPrice) => {
            if (menuItemPrice.includes(';')) {
                throw new Error("&bull;Not Allowed");
            } else {
                return true;
            }
        }).bail()
        .notEmpty().withMessage('&bull;Please Enter a Price.').bail()
        .trim(),
    checkItemDescription: check('menuItemDescription')
        .notEmpty().withMessage('&bull;Please Enter a Description.').bail()
        .escape()
        .custom((menuItemDescription) => {
            if (menuItemDescription.includes(';')) {
                throw new Error("&bull;Not Allowed");
            } else {
                return true;
            }
        }).bail()
        .trim(),


    // Event Forms validation and sanitization
    checkEventFile: check('eventImage')
        .custom((eventImage, { req }) => {
            if (!(req.file)) {
                throw new Error('&bull;Please Choose a File.');
            } else {
                let extension = (path.extname(req.file.originalname)).toLowerCase();
                switch (extension) {
                    case '.jpg':
                        return '.jpg';
                    case '.jpeg':
                        return '.jpeg';
                    case '.png':
                        return '.png';
                    default:
                        return false;
                }
            }
        }),
    checkEventName: check('eventName')
        .escape()
        .notEmpty().withMessage('&bull;Please Enter an Event Name.').bail()
        .custom((eventName) => {
            if (eventName.includes(';')) {
                throw new Error("&bull;Not Allowed");
            } else {
                return true;
            }
        }).bail()
        .trim(),
    checkEventDate: check('eventDate')
        .escape()
        .custom((eventDate) => {
            if (eventDate.includes(';')) {
                throw new Error("&bull;Not Allowed");
            } else {
                return true;
            }
        }).bail()
        .notEmpty().withMessage('&bull;Please Enter a Date.').bail()
        .trim(),
    checkEventLocation: check('eventLocation')
        .escape()
        .notEmpty().withMessage('&bull;Please Enter a Location.').bail()
        .custom((eventLocation) => {
            if (eventLocation.includes(';')) {
                throw new Error("&bull;Not Allowed");
            } else {
                return true;
            }
        }).bail()
        .trim(),


    // Gallery form validation and sanitization
    checkGalleryFile: check('galleryImage')
        .custom((galleryImage, { req }) => {
            if (!(req.file)) {
                throw new Error('&bull;Please Choose a File.');
            } else {
                let extension = (path.extname(req.file.originalname)).toLowerCase();
                switch (extension) {
                    case '.jpg':
                        return '.jpg';
                    case '.jpeg':
                        return '.jpeg';
                    case '.png':
                        return '.png';
                    default:
                        return false;
                }
            }
        }),


    // Login validation and sanitization
    sanitizeUsername: check('username')
        .escape()
        .trim(),
    verifyLoginDetails: check('password')
        .escape()
        .trim()
        .custom(async (password, { req }) => {
            const foundUser = await Admin.findOne({ username: req.body.username });
            if (!(foundUser)) {
                throw new Error('Incorrect username or password')
            }
            const isValid = await bcrypt.compare(password, foundUser.password);
            if (!(isValid)) {
                // what we put in error here will be the msg property on the validation error
                throw new Error('Incorrect username or password')
            }
        }),
}