const mongoose = require('mongoose');

const SLOT_BOOKING_SCHEMA = new mongoose.Schema({
    Availability_Id: { type: String },
    Slot_Id: { type: String },
    Supplier_Id: { type: String },
    Admin_Id: { type: String },
    Date: { type: String },
    Availability_Type: { type: String },
    Status: { type: String, default: "Requested"},
    Created_At: { type: Date, default: Date.now }
});

module.exports = mongoose.model('slot_booking', SLOT_BOOKING_SCHEMA);