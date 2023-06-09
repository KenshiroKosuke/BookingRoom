import express from 'express';
import {addBooking,getFreeRoomsFromTime,getBookings, deleteBooking} from '../controllers/booking.js';
import { protect, authorize } from '../middlewares/auth.js';

const router = express.Router();

router.route('/slot/:roomId')
    .post(protect,addBooking)

router.route('/slot')
    .get(getFreeRoomsFromTime)

router.route('/:id')
    .delete(protect,deleteBooking)

router.route('/')
    .get(getBookings)

export { router }