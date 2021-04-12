const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Admin users Schema
const adminSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

// Static method on the Admin model itself to verify the password
adminSchema.statics.findAndValidate = async function (username, password) {
    const foundUser = await this.findOne({ username });
    const isValid = await bcrypt.compare(password, foundUser.password)
    return isValid ? foundUser : false;
}
module.exports = mongoose.model('Admin', adminSchema);