const express = require('express');
const router = express.Router();
const { requireLogin } = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });
// Menu controllers
const menu = require('../controllers/menu');
const  { checkItemFile, checkItemName, checkItemPrice, checkItemDescription } = require('../routes/validators')

// Menu Item Get route
router.get('/menu', menu.getMenu);
// Menu Item Post route
router.post('/admin/menu', requireLogin, upload.single('menuImage'), [
    checkItemName,
    checkItemPrice,
    checkItemDescription,
    checkItemFile
], menu.postMenuItem);
// Menu Update route
// Upload new image here if any
// Patch request so not all data gets cleared, only new data present replaces old data
router.patch('/admin/menu', requireLogin, upload.single('menuImage'), [
    checkItemName,
    checkItemPrice,
    checkItemDescription
], menu.updateMenuItem);
// Menu Item Delete Route
router.delete('/admin/menu', requireLogin, menu.deleteMenuItem);

module.exports = router;