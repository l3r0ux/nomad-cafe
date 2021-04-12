const mongoose = require('mongoose');

// Event schema
const eventSchema = new mongoose.Schema({
    eventImageUrl: {
        type: String,
    },
    eventImageName: {
        type: String
    },
    eventName: {
        type: String,
        required: [true, 'Cannot add an event without a name.']
    },
    eventDate: {
        type: String,
        required: [true, 'Cannot add an event without a date.']
    },
    eventLocation: {
        type: String,
        required: [true, 'Cannot add an event without a location.']
    }
});
module.exports = mongoose.model('Event', eventSchema);