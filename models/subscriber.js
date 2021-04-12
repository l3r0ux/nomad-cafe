const mongoose = require('mongoose');

// Subscriber schema
const subscriberSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: true
    }
})
module.exports = mongoose.model('Subscriber', subscriberSchema);