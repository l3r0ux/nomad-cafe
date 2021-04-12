const mongoose = require('mongoose');

// Menu item schema
const menuItemSchema = new mongoose.Schema({
    menuImageUrl: {
        type: String,
    },
    menuImageName: {
        type: String
    },
    menuItemName: {
        type: String,
        required: true
    },
    menuItemPrice: {
        type: Number,
        min: [0, 'Price can not be less than 0'],
        required: true
    },
    menuItemDescription: {
        type: String,
        required: true
    }
});
module.exports = mongoose.model('MenuItem', menuItemSchema);