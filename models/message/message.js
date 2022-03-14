const mongoose = require('mongoose');

const message = new mongoose.Schema({
    user_id: {type: String },
    text: {type: String },
    Chanel_Id: { type: String },
    Created_At: { type: Date, default: Date.now }
});

module.exports = mongoose.model('message', message);