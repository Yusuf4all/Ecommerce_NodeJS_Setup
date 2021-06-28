const mongoose = require('mongoose');

const SLOT_SCHEMA = new mongoose.Schema({
    Start_Time: { type: Number, default: null },
    End_Time: { type: Number, default: null },
    Start_Time_Zone: { type: String, default: null },
    End_Time_Zone: { type: String, default: null },
    Is_Booked: { type: Boolean, default: false },
    Is_Available: { type: Boolean, default: false },
    Slot_No: { type: Number }
})


const AVAILABILITY_SCHEMA = new mongoose.Schema({
    From_Time: { type: String, default: null },
    To_Time: { type: String, default: null },
    Admin_Id: { type: String, default: null },
    Date: { type: String, default: null },
    Day: { type: String, default: null },
    Slots: [SLOT_SCHEMA],
    Created_At: { type: Date, default: Date.now() },
})

module.exports = mongoose.model('availability', AVAILABILITY_SCHEMA);