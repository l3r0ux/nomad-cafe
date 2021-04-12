// Middleware to check if user is logged in/protect routes
module.exports.requireLogin = (req, res, next) => {
    if (!req.session.admin_id) {
        return res.redirect('/')
    }
    next();
}

