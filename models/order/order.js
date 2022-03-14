const mongoose = require('mongoose');

// const ORDER_DETAILS_SCHEMA = new mongoose.Schema({
//     Product_Id: { type: String },
//     Product_Quantity: { type: Number },
//     Created_At: { type: Date, default: Date.now }
// });

const ORDER_SCHEMA = new mongoose.Schema({
    User_Id: { type: String },
    Order_Amount: { type: Number },
    Order_Ship_Name: { type: String },
    Order_Ship_Address: { type: String },
    Order_Ship_Address2: { type: String },
    City: { type: String },
    State: { type: String },
    Zip: { type: Number },
    Country: { type: String },
    Phone: { type: String },
    Fax: { type: String },
    Email: { type: String },
    Order_Status: { type: String, default: 'Draft' },
    Order_Type: { type: String },
    is_Active: { type: Boolean, default: false },
    Payment_Id: { type: String },
    Payment_Type: { type: String },
    Products: { type: [String], default: [] },
    Created_At: { type: Date, default: Date.now }
});

module.exports = mongoose.model('order', ORDER_SCHEMA);