const express = require('express');
// Getting our email checking validator
const { checkFullName, checkEmail, checkMessage, checkFirstName } = require('../routes/validators');

const router = express.Router();
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });
// Contact and subscriber controllers
const contact = require('../controllers/subscriber');

// Contact Post route
// Sanitize first then validate
router.post('/contact-us', upload.none(), [
    checkFullName,
    checkEmail,
    checkMessage
], contact.postContact);
// Subscriber Post route
router.post('/subscribe', upload.none(), [
    checkFirstName,
    checkEmail
], contact.postSubscriber);
// Subscriber Delete route
// getting the token off of the req.params
router.get('/subscriber/delete/:token', upload.none(), contact.deleteSubscriber);

module.exports = router;