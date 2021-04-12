const { validationResult } = require('express-validator');

const Admin = require('../models/admin');
const path = require('path');
const loginTemplate = require('../views/admin-login')
const errorTemplate = require('../views/error');

// Get Admin page
module.exports.getAdminPage = (req, res) => {
    res.sendFile(path.join(__dirname, '../views/admin.html'));
}

// Get Login page
module.exports.getLoginPage = (req, res) => {
    // if already logged in, take to admin page
    if (req.session.admin_id) {
        return res.redirect('/admin');
    }
    res.send(loginTemplate({ errors: null }));
}

// Log user in, set them in session
module.exports.login = async (req, res) => {
    try {
        // results from the validation
        const validationErrors = validationResult(req);
        if (validationErrors.errors.length > 0) {
            res.send(loginTemplate({ validationErrors }));
        } else {
            let { username, password } = req.body;
            // This commented out code was to use this route to add a new admin
            // password = await bcrypt.hash(password, 12);
            // const admin = new Admin({ username, password });
            // await admin.save();
            // req.session.admin_id = admin._id;
            const foundAdmin = await Admin.findAndValidate(username, password);
            if (foundAdmin) {
                req.session.admin_id = foundAdmin._id;
                return res.redirect('/admin');
            } else {
                res.redirect('/admin/login');
            }
        }
    } catch (e) {
        res.send(errorTemplate({ error: e }));
    }
};

// Log admin out
module.exports.logout = (req, res) => {
    req.session.admin_id = null;
    res.redirect('/');
}