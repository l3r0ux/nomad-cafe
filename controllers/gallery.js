const Gallery = require('../models/gallery');
const { cloudinary } = require('../cloudinary');
const { validationResult } = require('express-validator');

// Get gallery images
module.exports.getGallery = async (req, res) => {
    try {
        // making sure newest added items are first in queue
        const galleryImages = await Gallery.find({});
        res.send(galleryImages);
    } catch (e) {
        // log error for dev purposes
        // if couldnt find events, send message to front end
        res.send({ error: `Something went wrong: <br> Could not find gallery images.` });
    }

}

// Post Gallery image
module.exports.postGalleryImage = async (req, res) => {
    // Validation and sanitization
    const validationErrors = validationResult(req);
    try {
        if (validationErrors.errors.length > 0) {
            res.send(validationErrors)
        } else {
            const newGalleryImage = new Gallery();
            newGalleryImage.galleryImageUrl = req.file.path;
            newGalleryImage.galleryImageName = req.file.filename;
            const saved = await newGalleryImage.save();
            res.send(saved);
        }
    } catch (e) {
        res.send({ error: e });
    }
}

// Delete gallery image
module.exports.deleteGalleryImage = async (req, res) => {
    try {
        // finding and deleting that menu item with id and saving it to a variable
        const deleted = await Gallery.findOneAndDelete({ _id: req.body.id });
        // setting the filename to be the filename that was on deleted item
        let filename = deleted.galleryImageName;
        // using filename to delete the image from cloudinary
        await cloudinary.uploader.destroy(filename);
        res.send(deleted);
    } catch (e) {
        res.send({ error: e });
    }
}