const { succesResponse, errorResponse } = require('../../services/response');
const { saveAvailability, getAvailability, updateAvailability  } = require('../../models').availabilityTwoModule;
const moment = require('moment');

module.exports = {
    /** function for set and create Availability */
    async setAvailability(req,res){
        let DATE = req.body.Date;
        let FROM_TIME = req.body.From_Time;
        let TO_TIME = req.body.To_Time
        if(!DATE) return errorResponse(res, 422, 'Date is required!');
        try{
            let AVAILABILITY_DATA;
            let SUCCESS;
            req.body.Day = moment(DATE).format('dddd');
            req.body.Admin_Id = req.user._id;
            AVAILABILITY_DATA = await getAvailability({ Date: DATE, Admin_Id: req.user._id });
            if(!AVAILABILITY_DATA){
                console.log('new create')
                req.body.Slots =  await createSlot();
                const SAVE_DATA = await saveAvailability(req.body)
                SUCCESS = await createAvailability(SAVE_DATA.Slots, FROM_TIME, TO_TIME, DATE, req.user._id)
            }else{
                console.log("only update");
                SUCCESS = await createAvailability(AVAILABILITY_DATA.Slots, FROM_TIME, TO_TIME, DATE, req.user._id)
            }
            if(!SUCCESS) return errorResponse(res, 422, 'Please enter a valid timing!')
            AVAILABILITY_DATA = await getAvailability({ Date: DATE, Admin_Id: req.user._id });
            return succesResponse(res, 200, AVAILABILITY_DATA);
        }catch(err){
            console.log(err)
            return errorResponse(res, 422, err);
        }
    }
}

/** function for create slots */
async function createSlot(){
    let SLOTS = [];
    for(let i = 0; i < 24; i++){
        if(i < 12){
            SLOTS.push({
                Start_Time: i, 
                End_Time: i + 1, 
                Start_Time_Zone: 'am',
                End_Time_Zone: i == 11 ? 'pm' : 'am', 
                Slot_No: i + 1 
            });
        }else{
            SLOTS.push({
                Start_Time: i == 12 ? 12 : i - 12 , 
                End_Time: i == 23 ? 0 : i - 11, 
                Start_Time_Zone: 'pm',  
                End_Time_Zone: i == 23 ? 'am' : 'pm',
                Slot_No: i + 1 
            });
        }
        if(i == 23) return SLOTS;
    }
}

/** function for create Availability */
async function createAvailability(slots, from_time, to_time, date, admin_id){
    let FROM_TIME_ZONE = from_time.slice(5, 7);
    let TO_TIME_ZONE = to_time.slice(5, 7);
    from_time = from_time[0] != 0 ? from_time.slice(0, 2) : from_time.slice(1, 2);
    to_time = to_time[0] != 0 ? to_time.slice(0, 2) : to_time.slice(1, 2);
    from_time = parseInt(from_time)
    to_time =  parseInt(to_time)

    if((FROM_TIME_ZONE == 'am' && from_time == 12) || (TO_TIME_ZONE == 'am' && to_time == 12) ){
        console.log('7777777777777777777777')
        return false   
    }
    if(FROM_TIME_ZONE == 'pm' && TO_TIME_ZONE == 'pm'){
        console.log('lllllllllllllllllll')
        from_time = from_time == 12 ? from_time + 1 : from_time + 13;
        to_time = to_time + 13;
        await updateSlots( from_time, to_time, admin_id, slots, date );
        return true;    
    }
    if(FROM_TIME_ZONE == 'am' && TO_TIME_ZONE == 'pm' && to_time == 12){
        console.log('kkkkkkkkkkkkkkkkkk')
        from_time = from_time + 1;
        to_time = to_time + 1;
        await updateSlots( from_time, to_time, admin_id, slots, date );
        return true;  
    }
    if(FROM_TIME_ZONE == 'am' && TO_TIME_ZONE == 'am' && to_time != 12){
        console.log('qqqqqqqqqqqqqqqqqqq')
        from_time = from_time + 1;
        to_time = to_time == 0 ? to_time + 25 : to_time + 1
        await updateSlots( from_time, to_time, admin_id, slots, date );
        return true; 
    }
    if(FROM_TIME_ZONE == 'am' && TO_TIME_ZONE == 'pm' && from_time != 12 ){
        console.log('ooooooooooooooooooo')
        from_time = from_time + 1;
        to_time = to_time + 13;
        await updateSlots( from_time, to_time, admin_id, slots, date );
        return true; 
    }
    if(FROM_TIME_ZONE == 'pm' && TO_TIME_ZONE == 'am' && to_time == 0){
        console.log('99999999999999999999')
        from_time = from_time == 12 ? from_time + 1 : from_time + 13;
        to_time = to_time + 25;
        await updateSlots( from_time, to_time, admin_id, slots, date );
        return true;
    }
}

/** function for update slots */
async function updateSlots(from_time, to_time, admin_id, slots, date ){
    let DATA = await getUpdatedSlot(from_time, to_time, slots);
    let QUERY = { Date: date, Admin_Id: admin_id }
    await updateAvailability(QUERY, DATA);
}

/** finction for get update slots */
async function getUpdatedSlot(from_time, to_time, slots){
    for(let i = 0 ; i < 24 ; i ++ ){
        if(i >= from_time - 1 && i < to_time - 1){
            slots[i].Is_Booked = false
            slots[i].Is_Home_Available = true
            slots[i].Is_Office_Available = true
        }else{
            slots[i].Is_Booked = false
            slots[i].Is_Home_Available = false
            slots[i].Is_Office_Available = false
        }
        if(i == 23) return slots
    }
}