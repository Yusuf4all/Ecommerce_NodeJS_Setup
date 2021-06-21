const mongoose = require('mongoose');

const USER_SCHEMA = new mongoose.Schema({
    First_Name: { type: String },
    Last_Name: { type: String },
    Email: { type: String },
    Password: { type: String },
    City: { type: String },
    State: { type: String },
    Zip_code: { type: Number },
    Email_verified: { type: Boolean, default: false },
    Verification_Code: { type: Number },
    Phone_Number: { type: String },
    Fax: { type: String },
    Country: { type: String },
    Address1: { type: String },
    Address2: { type: String },
    Stripe_Customer_Id: { type: String },
    Strip_Card_Id: { type: String },
    Orders: { type: [String], default: [] },
    Created_At: { type: Date, default: Date.now }
});

module.exports = mongoose.model('user', USER_SCHEMA);