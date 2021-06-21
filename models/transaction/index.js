const TRANSACTION_MODEL = require('./transaction');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

const TRANSACTION_MODULE = {}

// TRANSACTION_MODULE.create = async function(data){
//     return await new TRANSACTION_MODEL(data).save();
// }


TRANSACTION_MODULE.createCutomer = async function(email){
    return stripe.customers.create(
        {
          description: `Customer for ${email}`,
          email: email
        }
    )
}

TRANSACTION_MODULE.getToken = async function(card){
    return await stripe.tokens.create({
        card:{
            number: card.number,
            exp_month: card.exp_month,
            exp_year: card.exp_year,
            cvc: card.cvc,
        }
    })
}


TRANSACTION_MODULE.createCard = async function(customerId, token){
    return stripe.customers.createSource(
        customerId,
        { source: token }
      )
}

TRANSACTION_MODULE.create = async function (order_data, description, user){
    console.log("inside function")
    let data
    const charge = await stripe.charges.create(
        {
            amount: order_data.Order_Amount * 100,
            description: description,
            currency: 'inr',
            customer: user.Stripe_Customer_Id,
        }
    )
    console.log(charge)
    if (!charge) {
        data = {
            Order_Id: order_data._id,
            Payment_Type: 'New Payment',
            Payment_Date: new Date(),
            Amount: order_data.Order_Amount,
            Charge_Id: null,
            Transaction_Status: 'Failed',
            Payment_By: user._id,
        }
    } else{
        data = {
            Order_Id: order_data._id,
            Payment_Type: 'New Payment',
            Payment_Date: new Date(),
            Amount: order_data.Order_Amount,
            Receipt_Url: charge.receipt_url,
            Transaction_Id: charge.balance_transaction,
            Payment_Method: charge.payment_method,
            Charge_Id: charge.id,
            Transaction_Status: 'Succeeded',
            Payment_By: user._id,
        }
    }    
    return await new TRANSACTION_MODEL(data).save();
}


module.exports = TRANSACTION_MODULE;

