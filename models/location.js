const mongoose = require('mongoose');

// Location schema
const locationSchema = new mongoose.Schema({
    longitude: {
        type: Number,
        required: true
    },
    latitude: {
        type: Number,
        required: true
    },
    mapboxToken: {
        type: String,
        required: true
    }
});
module.exports = mongoose.model('Location', locationSchema);