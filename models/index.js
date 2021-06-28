const availability = require('./availability/availability');

module.exports={
    userModule: require('./user'),
    adminModule: require('./admin'),
    productModule: require('./product'),
    orderModule: require('./order'),
    cartModule: require('./cart'),
    categoryModule: require('./category'),
    transactionModule: require('./transaction'),
    supplierModule: require('./supplier'),
    availabilityModule: require('./availability'),
    slotBookingModule: require('./slotBooking')
}