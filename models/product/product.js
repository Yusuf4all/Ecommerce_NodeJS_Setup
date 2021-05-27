const mongoose = require('mongoose');

// const PRODUCT_CATEGORY_SCHEMA = new mongoose.Schema({
//     Category_Name: { type: String },
//     Category_Desc: { type: String },
//     Modified_At: { type: Date },
//     Created_At: { type: Date, default: Date.now }
// });

const PRODUCT_SCHEMA = new mongoose.Schema({
    Product_Name: { type: String },
    Product_Short_Desc: { type: String },
    Product_Long_Desc: { type: String },
    Price: { type: String },
    is_In_Stock: { type: Boolean, default: false },
    Product_Category_Id: { type: String },
    Produce_Inventory_Id: { type: String },
    Product_Discount_Id: { type: String },
    Modified_At: { type: Date },
    Created_At: { type: Date, default: Date.now }
});

module.exports = mongoose.model('product', PRODUCT_SCHEMA);