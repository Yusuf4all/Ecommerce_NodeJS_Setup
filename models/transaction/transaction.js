const mongoose = require('mongoose');

const TRANSACTION_SCHEMA = new mongoose.Schema({
    Order_Id: { type: String, default: null },
    Payment_By: { type: String, default: null },
    Payment_Type: { type: String, default: null },
    Payment_Date: Date,
    Amount: Number,
    Charge_Id: { type: String, default: null },
    Receipt_Url: { type: String, default: null },
    Payment_Method: { type: String, default: null },
    Transaction_Status: { type: String, default: null },
    Transaction_Id: { type: String, default: null },
    Created_At: { type: Date, default: Date.now }
  });

  module.exports = mongoose.model('transaction',TRANSACTION_SCHEMA);
  
