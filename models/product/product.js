const mongoose = require('mongoose');

/** this is product review schema  */
const PRODUCT_REVIEW_SCHEMA = new mongoose.Schema({
    Review: { type: Number },
    Description: { type: String },
    User_Id: { type: String },
    Updated_At: { type: Date },
    Created_At: { type: Date, default: Date.now }
});

/** this is product inventory schema  */
// const PRODUCT_INVENTORY_SCHEMA = new mongoose.Schema({
//     Total_Quantity: { type: Number, default: 0 },
//     Sales_Quantity: { type: Number, default: 0 },
//     Updated_At: { type: Date },
//     Created_At: { type: Date, default: Date.now }
// });

/** this is discount schema  */
// const PRODUCT_DISCOUNT_SCHEMA = new mongoose.Schema({
//     Discount_name: { type: Number, default: 0 },
//     Discount_Desc: { type: Number, default: 0 },
//     Discount_percent: { type: Number },
//     Active: { type: Boolean },
//     Updated_At: { type: Date },
//     Created_At: { type: Date, default: Date.now },
//     Discount_Available: { type: Date } 
// });

/** this is product schema  */
const PRODUCT_SCHEMA = new mongoose.Schema({
    Product_Name: { type: String },
    Supplier_Id: { type: String },
    Product_Short_Desc: { type: String },
    Product_Long_Desc: { type: String },
    Price: { type: Number },
    Product_Brand: { type: String },
    // is_In_Stock: { type: Boolean, default: false },
    Reviews: [PRODUCT_REVIEW_SCHEMA],
    Category_Id: { type: String },
    Inventory: { type: Object, default: null },
    Discount: { type: Object, default: null },
    Updated_At: { type: Date },
    Created_At: { type: Date, default: Date.now }
});

module.exports = mongoose.model('product', PRODUCT_SCHEMA);