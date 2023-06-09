import {Booking} from '../models/Booking.js'
import { Room } from '../models/Room.js';

export async function getBookings(req,res,next) {
    const bookings = await Booking.find()
    res.status(200).json({
        success: true,
        data: bookings
    })
}

export async function getFreeRoomsFromTime(req,res,next) {
    let rooms = await Room.find()
    try{
        let freeRooms = []
        if (req.body.start > req.body.end){
            res.status(400).json({
                success: false,
                message: "Invalid time"
            });
        }
        for (let i=0 ; i< rooms.length; i++) {
            let resultBooking = await Booking.findOne({
                room: rooms[i]._id,
                $or : [{start: {$gte: req.body.start, $lte: req.body.end}},{end: {$gte: req.body.start, $lte: req.body.end}}]
            })
            if (!resultBooking){
                freeRooms.push(rooms[i])
            }
        }
        res.status(200).json({
            success: true,
            count: freeRooms.length,
            data: freeRooms
        });
    }catch(err){
        res.status(500).json({
            success: false,
            message: "Error occured"
        });
    }
}

// export async function getBooking(req,res,next) {
//     try {
//         const booking = await Booking.findById(req.params.id).populate({
//             path: 'room',
//             select: 'name description tel'
//         })
//         if (!booking){
//             res.status(404).json({ success: false, msg: `no appt id ${req.params.id}` })
//         }
//         res.status(200).json({
//             success: true,
//             data: booking
//         })
//     } catch (err){
//         return res.status(400).json({ success: false, msg: "cannot find appt" })
//     }
// }

export async function addBooking(req, res, next) {
    try {
        // getting user (id) from the login procedure (via protect middleware)
        req.body.user = req.user.id
        const existedAppt = await Booking.find({user:req.user.id})
        if(!existedAppt){
            return res.status(400).json({ success: false, msg: "no user with that id exists " })
        }
        // using body to store data to save
        req.body.room = req.params.roomId;
        const room = await Room.findById(req.params.roomId);
        if (!room){
            return res.status(404).json({success:false,msg:`no room id ${req.params.roomId}` })
        }
        if (req.body.start > req.body.end){
            return res.status(400).json({
                success: false,
                message: "Invalid time"
            });
        }
        // create
        let resultBooking = await Booking.findOne({
            room: req.params.roomId,
            $or : [{start: {$gte: req.body.start, $lte: req.body.end}},{end: {$gte: req.body.start, $lte: req.body.end}}]
        })
        if (resultBooking){
            return res.status(400).json({ success: false, message: `Room is not empty at that time` })
        }
        const booking = await Booking.create(req.body);
        res.status(201).json({ success: true, data: booking })
    } catch (err) {
        res.status(500).json({ success: false, message: err })
    }
}

export async function deleteBooking(req, res, next) {
    try {
        const booking = await Booking.findById(req.params.id)
        if (booking.user.toString()!==req.user.id && req.user.role !== 'admin' ){
            return res.status(404).json({success:false,msg:`User ${req.user.id} is not authorized to delete this booking.`})
        }
        if (!booking){
            return res.status(404).json({success:false, msg:`no booking ${req.params.id}`})
        }
        await Booking.findByIdAndDelete(req.params.id)
        res.status(200).json({ success: true, data: {} })
    } catch (err) {
        console.log(err)
        res.status(400).json({ success: false, message: `cannot delete booking ${req.params.id}` })
    }
}
