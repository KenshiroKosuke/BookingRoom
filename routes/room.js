import express from 'express';
import {createRoom,getRoom,getRooms} from '../controllers/room.js';
import { protect, authorize } from '../middlewares/auth.js';

const router = express.Router();

router.route('/:id')
    .get(getRoom)

router.route('/')
    .get(getRooms)
    .post(protect, authorize('admin'), createRoom);

export { router }