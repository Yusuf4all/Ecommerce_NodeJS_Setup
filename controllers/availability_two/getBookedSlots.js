const { succesResponse, errorResponse } = require('../../services/response');
const { getAvailability } = require('../../models').availabilityTwoModule;
const moment = require('moment');

module.exports = {
    async getBookingSlots(req, res){
        const DATE = req.params.date;
        if(!DATE) return errorResponse(res, 422, "Date is required!");
        try{
            const AVAILABILITYS = await getAvailability({Date: DATE, Admin_Id: req.user._id});
            const BOOKING_SLOTS_DETAILS = await getBookedSlots(AVAILABILITYS.Slots);
            return succesResponse(res, 200, BOOKING_SLOTS_DETAILS);
        }catch(err){
            console.log(err)
            return errorResponse(res, 422, err);
        }
    }
}

async function getBookedSlots(slots){
    let Home_Availability = []
    let Office_Availability = []
    for(let i = 0; i < slots.length; i++ ){
        if(slots[i].Is_Booked && slots[i].Is_Home_Available && !slots[i].Is_Office_Available){
            Home_Availability.push(slots[i-1])
            Home_Availability.push(slots[i])
            if(!slots[i+2].Is_Booked){
                Home_Availability.push(slots[i+1])
            }
        }
        if(slots[i].Is_Booked && !slots[i].Is_Home_Available && slots[i].Is_Office_Available){
            Office_Availability.push(slots[i]);
        }
        if(!slots[i].Is_Booked && slots[i].Is_Home_Available && slots[i].Is_Office_Available){
            Home_Availability.push(slots[i]);
            Office_Availability.push(slots[i]);
        }
        if(i == slots.length -1){
            return {Home_Availability, Office_Availability};
        }
    }
}