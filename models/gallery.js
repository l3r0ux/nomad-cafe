const mongoose = require('mongoose');

// Gallery Schema
const gallerySchema = new mongoose.Schema({
    galleryImageUrl: {
        type: String,
        required: true
    },
    galleryImageName: {
        type: String,
        required: true
    }
});
module.exports = mongoose.model('GalleryImage', gallerySchema);