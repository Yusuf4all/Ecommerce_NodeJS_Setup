const mongoose = require('mongoose');

const ADMIN_SCHEMA = new mongoose.Schema({
    First_Name: { type: String },
    Last_Name: { type: String },
    Email: { type: String },
    Password: { type: String },
    Created_At: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Admin', ADMIN_SCHEMA);