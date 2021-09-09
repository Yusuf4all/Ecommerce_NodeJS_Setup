const { succesResponse, errorResponse } = require('../../services/response');
const { saveAvailability, getAvailability, updateAvailability  } = require('../../models').availabilityTwoModule;
const moment = require('moment');

module.exports = {
    /** function for set and create Availability */
    async setAvailabilityByHours(req, res){
        const { Date , Regular_Hours, Off_Hours} = req.body;
        if(!Date) return errorResponse(res, 422, 'Date is Required!');
        try{
            const AVAILABILITY = await getAvailability({ Date: Date, Admin_Id: req.user._id });
            if(!AVAILABILITY) return errorResponse(res, 422, 'Abailability not exist on this date!');

            if(Regular_Hours){
                
            }


        }catch(err){
            return errorResponse(res, 422, err.message);
        }
    }
}

