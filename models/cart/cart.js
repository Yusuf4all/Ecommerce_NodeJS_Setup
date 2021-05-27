const mongoose = require('mongoose');

const CART_SCHEMA = new mongoose.Schema({
    Product_Ids: { type: [String], default: [] },
    User_Id: { type: String },
    Created_At: { type: Date, default: Date.now }
});

module.exports = mongoose.model('cart', CART_SCHEMA);