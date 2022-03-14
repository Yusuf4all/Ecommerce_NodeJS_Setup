const mongoose = require('mongoose');


const CATEGORY_SCHEMA = new mongoose.Schema({
    Category_Name: { type: String },
    Parent_Id: { type: String },
    Category_Type: { type: String, default: 'Parent'}
})

module.exports = mongoose.model('category',CATEGORY_SCHEMA);

