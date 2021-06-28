const express = require('express');
const ROUTE = express.Router();
const authorize = require('../services/authorization');
const ROLES = require('../services/roles');
const { setAvailability } = require('../controllers/availability/setAvailability');
const { getAvailabilityes, slotBooking, getBookingSlots } = require('../controllers/availability/getAvailabilityes');

ROUTE.post('/set-availability', authorize(ROLES.Admin), setAvailability);
ROUTE.get('/get-availabilityes/:date/:admin_id', getAvailabilityes);
ROUTE.put('/slot-booking/:slot_id', authorize(ROLES.Supplier), slotBooking);
ROUTE.get('/get-booking-slots', authorize([ROLES.Supplier, ROLES.Admin]), getBookingSlots);



module.exports = ROUTE;
