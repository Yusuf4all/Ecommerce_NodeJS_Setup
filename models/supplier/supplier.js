const mongoose = require('mongoose');

const SUPPLIER_SCHEMA = new mongoose.Schema({
    Name: { type: String, default: null },
    Email: { type: String, default: null },
    Password: { type: String, default: null },
    Phone: { type: String, default: null },
    Address1: { type: String, default: null },
    Address2: { type: String, default: null },
    City: { type: String, default: null },
    State: { type: String, default: null },
    Postal_Code: { type: String, default: null },
    Country: { type: String, default: null },
    Fax: { type: String, default: null },
    Website: { type: String, default: null },
    Discount_Type: { type: String, default: null },
    Discount_Rate: { type: Number, default: null },
    Discount_Available: { type: Boolean, default: false },
    Type_Goods: { type: String, default: null },
    Ranking: { type: Number, default: null },
    Stripe_Account: { type: String, default: null },
    Is_Active: { type: Boolean, default: false },
    Created_At: { type: Date, default: Date.now }
});

module.exports = mongoose.model('supplier', SUPPLIER_SCHEMA);