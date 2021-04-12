const express = require('express');
const router = express.Router();
const { requireLogin } = require('../middleware');
// Location controllers
const location = require('../controllers/location');

// Location Get route
router.get('/location', location.getLocation);
// Location Post route
router.post('/admin/location', requireLogin, location.postLocation);
// Location delete route
router.delete('/admin/location', requireLogin, location.deleteLocation);

module.exports = router;