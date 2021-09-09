const mongoose = require('mongoose');

const conversation = new mongoose.Schema({
    User1: {type: String },
    User2: {type: String },
    Chanel_Id: { type: String },
    Created_At: { type: Date, default: Date.now }
});

module.exports = mongoose.model('conversation', conversation);