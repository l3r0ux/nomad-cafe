const express = require('express');
const router = express.Router();
const { requireLogin } = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });
// Gallery controllers
const gallery = require('../controllers/gallery')
const  { checkGalleryFile } = require('../routes/validators')

// Gallery Get route
router.get('/gallery', gallery.getGallery);
// Gallery Post route
router.post('/admin/gallery', requireLogin, upload.single('galleryImage'), [
    checkGalleryFile
], gallery.postGalleryImage);
// Gallery Delete route
router.delete('/admin/gallery', requireLogin, gallery.deleteGalleryImage);

module.exports = router;