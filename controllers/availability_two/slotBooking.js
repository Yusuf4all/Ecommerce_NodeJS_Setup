const { succesResponse, errorResponse } = require('../../services/response');
const { bookSlot, getBookingSlotsDetails } = require('../../models').slotBookingModule;
const { getAvailableSlotTwo, updateAvailableSlot, findBookedSlot, getAvailability } = require('../../models').availabilityTwoModule;
const moment = require('moment');

module.exports = {
    /** function to take appointment  */
    async slotBooking(req, res){
        let { Date, Admin_Id, Availability_Type } = req.body;
        const SLOT_ID = req.params.slot_id;
        let RESPONSE;
        if(!Availability_Type) return errorResponse(res, 422, 'Availability_Type is required!')
        if(!Date) return errorResponse(res, 422, 'Date is required!');
        if(!Admin_Id) return errorResponse(res, 422, 'Admin_Id is required!');
        if(!SLOT_ID) return errorResponse(res, 422, 'slot_id is required is params!');
        try{
            let AVAILAVLE_SLOT = await getAvailableSlotTwo(Admin_Id, Date, SLOT_ID);
            console.log("AVAILAVLE_SLOT: ",AVAILAVLE_SLOT)
            if(AVAILAVLE_SLOT.length == 0 || AVAILAVLE_SLOT[0].Slots.length == 0) return errorResponse(res, 422, 'slot not available at this time!');
            const ID = AVAILAVLE_SLOT[0]._id;
            AVAILAVLE_SLOT = AVAILAVLE_SLOT[0].Slots[0];
            if(!AVAILAVLE_SLOT) return errorResponse(res, 422, 'slot not available at this time!')
            const AVAILABILITY_DATA = await getAvailability({Date: Date, Admin_Id: Admin_Id});
            const DATA = {
                Availability_Id: ID,
                Slot_Id: SLOT_ID,
                Supplier_Id: req.user._id,
                Admin_Id: Admin_Id,
                Date: Date,
                Availability_Type: Availability_Type,
            }
            if(Availability_Type == "Home"){
                const BOOKED_HOME_SLOTS = await bookHomeSlot(AVAILABILITY_DATA.Slots, SLOT_ID);
                if(!BOOKED_HOME_SLOTS) return errorResponse(res, 422, 'This slot not is available!');
                await updateAvailableSlot(ID, BOOKED_HOME_SLOTS);
                RESPONSE = await bookSlot(DATA);
                return succesResponse(res, 200, {Message: 'Office Slot booked successfully', data: RESPONSE});
            }else{
                const BOOKED_OFFICE_SLOTS = await bookOfficeSlot(AVAILABILITY_DATA.Slots, SLOT_ID);
                if(!BOOKED_OFFICE_SLOTS) return errorResponse(res, 422, 'This slot not is available!');
                await updateAvailableSlot(ID, BOOKED_OFFICE_SLOTS);
                RESPONSE = await bookSlot(DATA);
                return succesResponse(res, 200, {Message: 'Office Slot booked successfully', data: RESPONSE});
            } 
        }catch(err){
            console.log(err)
            return errorResponse(res, 422, err);
        }
    }
}

// async function getAvailableTimings(slots){return slots.filter(ele=> ele.Is_Available && !ele.Is_Booked)}


async function bookHomeSlot(slots, slot_id){
    for(let i = 0; i < slots.length; i++){
        if(slots[i]._id == slot_id){
            console.log(".....................")
            if((slots[i].Start_Time == 0 && slots[i].Start_Time_Zone == 'am') || (slots[i].Start_Time == 11 && slots[i].Start_Time_Zone == 'pm')){
                console.log('bbbbbbbbbbbbbbbbbb')
                return false
            }
            if(slots[i-1].Is_Booked && (slots[i-1].Is_Home_Available || slots[i-1].Is_Office_Available)){
                console.log('ertyuiytrtyuioiuytrtyuiyt')
                return false
            }
            if(!slots[i-1].Is_Booked && slots[i-1].Is_Home_Available && slots[i-1].Is_Office_Available ){
                console.log("lllllllllllll")
                slots[i-1].Is_Home_Available = false
                slots[i-1].Is_Office_Available = false
                slots[i-1].Travel_Time = true
                slots[i].Is_Booked = true
                slots[i].Is_Home_Available = true
                slots[i].Is_Office_Available = false
                if(slots[i+1].Is_Booked) return false
                slots[i+1].Is_Home_Available = false
                slots[i+1].Is_Office_Available = false
                slots[i+1].Travel_Time = true
            }
            else if(slots[i-2].Is_Booked && slots[i-2].Is_Home_Available && !slots[i-2].Is_Office_Available && !slots[i-1].Is_Booked){
                console.log("kkkkkkkkkkkkkkkkk")
                slots[i].Is_Booked = true
                slots[i].Is_Home_Available = true
                slots[i].Is_Office_Available = false
                if(slots[i+1].Is_Booked) return false
                slots[i+1].Is_Home_Available = false
                slots[i+1].Is_Office_Available = false
                slots[i+1].Travel_Time = true
            }else{
                console.log("uuuuuuuuuuuuuu")
                return false;
            }
       }
       if(i == slots.length - 1){
           return slots;
       }
    }
}

async function bookOfficeSlot(slots, slot_id){
    for(let i = 0; i < slots.length; i++){
        if(slots[i]._id == slot_id){
            console.log('zzzzzzzzzzzzzzzzz')
            if(slots[i].Is_Booked){
                console.log("bnbnbnbnbnbnbnbnbnbnbnbnbn")
                return false
            }
            if(!slots[i].Is_Booked && slots[i].Is_Home_Available && slots[i].Is_Office_Available){
                console.log('ppppppppppppppppppppp')
                slots[i].Is_Booked = true;
                slots[i].Is_Home_Available = false
            }else if(
                (slots[i-1].Is_Booked && slots[i-1].Is_Home_Available) || 
                (slots[i+1].Is_Booked && slots[i+1].Is_Home_Available) || 
                slots[i].Is_Booked
            ){
                console.log('nnnnnnnnnnnnnnnnnn')
                return false
            }else{
                console.log('sssssssssssssssssssss')
                slots[i].Is_Booked = true;
                slots[i].Is_Home_Available = false
            }
        }
       if(i == slots.length - 1){
           return slots;
       }
    }
}