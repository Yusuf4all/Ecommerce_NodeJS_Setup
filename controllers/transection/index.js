const { createCutomer, getToken, createCard, create } = require('../../models/index').transactionModule;
const { updateUser, getUser } = require('../../models/index').userModule;
const { getOrder, updateOrder} = require('../../models/index').orderModule;
const { errorResponse, succesResponse } = require('../../services/response');


module.exports = {
    // function for add card 
    async addCard(req, res){
        const { number, exp_month, exp_year, cvc } = req.body;
        if(!number) return errorResponse(res, 422, 'number is Required!');
        if(!exp_month) return errorResponse(res, 422, 'exp_month is Required!');
        if(!exp_year) return errorResponse(res, 422, 'exp_year is Required');
        if(!cvc) return errorResponse(res, 422, 'cvc is Required!');
        try{
            const TOKEN_DATA = await getToken(req.body);
            const ID = req.user._id;
            await updateUser(ID, { Strip_Card_Id: TOKEN_DATA.card.id })
            const CARD_DATA = await createCard(req.user.Stripe_Customer_Id, TOKEN_DATA.id)
            return succesResponse(res, 200, CARD_DATA);
        }catch(err){
            return errorResponse(res, 422, err.message);
        }
    },

    async makePayment(req, res){
        const ORDER_ID = req.params.order_id;
        const DESCRIPTION = req.body.description;
        if(!DESCRIPTION) return errorResponse(res, 422, 'description is require!')
        if(!ORDER_ID) return errorResponse(res, 422, 'order_id is required is params!')
        try{
            const ORDER_DATA = await getOrder({_id: ORDER_ID});
            if(!ORDER_DATA) return errorResponse(res, 422, 'invalid order id');
            if(ORDER_DATA.User_Id != req.user._id) return errorResponse(res, 422, 'user id not matched!');
            if(ORDER_DATA.Order_Status == 'Active') return errorResponse(res, 422, "you can't do this payment because Order already Active!"); 
            const USER_DATA = await getUser({_id: req.user._id});
            if(!USER_DATA.Strip_Card_Id) return errorResponse(res, 422, 'please add your cadr first');
            const TRANSACTION_DATA = await create(ORDER_DATA, DESCRIPTION, USER_DATA);
            if(!TRANSACTION_DATA.Transaction_Status == 'Failed') return errorResponse(res, 422, 'transection failed!');
            await updateOrder(ORDER_ID, { Order_Status: 'Active' });
            return succesResponse(res, 200, TRANSACTION_DATA)
        }catch(err){
            return errorResponse(res, 422, err.message)
        }

    }
}

