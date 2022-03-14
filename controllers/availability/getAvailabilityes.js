const { succesResponse, errorResponse } = require('../../services/response');
const { bookSlot, getBookingSlotsDetails } = require('../../models').slotBookingModule;
const { saveAvailability, getAvailability, updateAvailability, getAvailableSlot, updateAvailableSlot, findBookedSlot } = require('../../models').availabilityModule;
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
    },

    /** function to take appointment  */
    async slotBooking(req, res){
        let { Date, Admin_Id } = req.body;
        const SLOT_ID = req.params.slot_id;
        if(!Date) return errorResponse(res, 422, 'Date is required!');
        if(!Admin_Id) return errorResponse(res, 422, 'Admin_Id is required!');
        if(!SLOT_ID) return errorResponse(res, 422, 'slot_id is required is params!');
        try{
            let AVAILABLE_SLOT = await getAvailableSlot(Admin_Id, Date, SLOT_ID);
            if(AVAILABLE_SLOT.length === 0 || AVAILABLE_SLOT[0].Slots.length == 0) return errorResponse(res, 422, 'this time is not available!')
            const ID = AVAILABLE_SLOT[0]._id
            AVAILABLE_SLOT = AVAILABLE_SLOT[0].Slots[0];
            const DATA = {
                Availability_Id: ID,
                Slot_Id: SLOT_ID,
                Supplier_Id: req.user._id,
                Admin_Id: Admin_Id,
                Date: Date
            }
            const SLOT_DATA = await bookSlot(DATA);
            await updateAvailableSlot(ID, AVAILABLE_SLOT)
            return succesResponse(res, 200, SLOT_DATA);
        }catch(err){
            console.log(err)
            return errorResponse(res, 422, err);
        }
    },

    async getBookingSlots(req, res){
        const DATE = req.body.Date;
        if(!DATE) return errorResponse(res, 422, "Date is required!");
        try{
            const DATA = {};
            DATA.Date = DATE;
            req.userType == 'Supplier' ? DATA.Supplier_Id = req.user._id : DATA.Admin_Id = req.user._id;
            const BOOKING_SLOTS_DETAILS = await getBookingSlotsDetails(DATA);
            const BOOKED_SLOTS = await getBookedSlots(BOOKING_SLOTS_DETAILS);
            return succesResponse(res, 200, BOOKED_SLOTS);
        }catch(err){
            console.log(err)
            return errorResponse(res, 422, err);
        }
    }
}

async function getAvailableTimings(slots){return slots.filter(ele=> ele.Is_Available && !ele.Is_Booked)}


async function getBookedSlots(booking_slots_details){
    let ARR = []
    for(let i = 0; i < booking_slots_details.length; i++){
        booking_slots_details[i]
        let SLOT = await findBookedSlot(booking_slots_details[i].Availability_Id, booking_slots_details[i].Slot_Id);
        ARR.push(SLOT[0].Slots[0])
        if(i == booking_slots_details.length -1)
        return ARR;
    } 
}