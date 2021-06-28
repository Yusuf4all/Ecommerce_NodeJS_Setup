const SLOT_BOOKING_MODEL = require('./slotBooking');

const SLOT_BOOKING_MODULE = {};

SLOT_BOOKING_MODULE.bookSlot = async function(data){
    return await new SLOT_BOOKING_MODEL(data).save();
}

SLOT_BOOKING_MODULE.getBookingSlotsDetails = async function(data){
    return await SLOT_BOOKING_MODEL.find(data)
}
module.exports = SLOT_BOOKING_MODULE;