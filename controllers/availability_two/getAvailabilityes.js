const { succesResponse, errorResponse } = require('../../services/response');
const { getAvailability } = require('../../models').availabilityTwoModule;
const moment = require('moment');

module.exports = {
    /** function for set and create availability */
    async getAvailabilityes(req,res){
        let { date , admin_id } = req.params;
        if(!date) return errorResponse(res, 422, 'date is required!');
        if(!admin_id) return errorResponse(res, 422, 'admin_id is required!');        
        try{
            let AVAILABILITY = await getAvailability({Date: date, Admin_Id: admin_id});
            if(!AVAILABILITY) return errorResponse(res, 422, 'The Admin not available on this date!');
            const AVAILABLE_TIMES =  await getAvailableTimings(AVAILABILITY.Slots);
            if(AVAILABLE_TIMES && AVAILABLE_TIMES.length < 0) return errorResponse(res, 422, 'Timing! not available!');
            return succesResponse(res, 200, AVAILABLE_TIMES)
        }catch(err){
            console.log(err)
            return errorResponse(res, 422, err);
        }
    }
}

async function getAvailableTimings(slots){
    const HOUR = parseInt(moment().hour())
    let Home_Availability = []
    let Office_Availability = []
    for(let i = HOUR + 1 ; i < slots.length; i++ ){
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