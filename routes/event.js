const express = require('express');
const router = express.Router();
const { requireLogin } = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });
// Event controllers
const event = require('../controllers/event');
const  { checkEventFile, checkEventName, checkEventDate, checkEventLocation } = require('../routes/validators')


// Event get route
router.get('/events', event.getEvents);
// Event Post route
router.post('/admin/events', requireLogin, upload.single('eventImage'), [
    checkEventFile,
    checkEventName,
    checkEventDate,
    checkEventLocation
], event.postEvent);
// Event Update route
router.patch('/admin/events', requireLogin, upload.single('eventImage'), [
    checkEventName,
    checkEventDate,
    checkEventLocation
], event.updateEvent);
// Event Delete route
router.delete('/admin/event', requireLogin, event.deleteEvent);

module.exports = router;