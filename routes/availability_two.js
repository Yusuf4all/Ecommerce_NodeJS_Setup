const express = require('express');
const ROUTE = express.Router();
const authorize = require('../services/authorization');
const ROLES = require('../services/roles');
const { setAvailability } = require('../controllers/availability_two/setAvailability_two');
const { slotBooking } = require('../controllers/availability_two/slotBooking');
const { getAvailabilityes } = require('../controllers/availability_two/getAvailabilityes');
const { getBookingSlots } = require('../controllers/availability_two/getBookedSlots')



ROUTE.post('/set-availability-two',authorize(ROLES.Admin),  setAvailability);
ROUTE.post('/slot-booking-two/:slot_id',authorize(ROLES.Supplier), slotBooking);
ROUTE.get('/get-availability-two/:date/:admin_id',authorize([ROLES.Supplier, ROLES.Admin]), getAvailabilityes);
ROUTE.get('/get-booked-slots-two/:date',authorize([ROLES.Supplier, ROLES.Admin]), getBookingSlots);



module.exports = ROUTE;
