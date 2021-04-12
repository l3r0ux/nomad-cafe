const express = require('express');

const { sanitizeUsername, verifyLoginDetails } = require('../routes/validators');

const router = express.Router();
const { requireLogin } = require('../middleware');
// Auth controllers
const auth = require('../controllers/auth');

// Route for admin with added functionality
router.get('/', requireLogin, auth.getAdminPage);
// Routes to log in and sign out
// Renders login form
router.get('/login', auth.getLoginPage);
// Sets user in session
// sanitize and validate the username and password
router.post('/login', [sanitizeUsername, verifyLoginDetails], auth.login);
// Log user out, remove session data
router.post('/logout', requireLogin, auth.logout);

module.exports = router;