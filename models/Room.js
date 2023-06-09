import mongoose from "mongoose";

const RoomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        unique: true,
        trim: true,
        maxlength: [30,'Name cannot be more than 30 characters']
    },
    size:{
        type: Number,
        required: [true, 'Please specify size'],
        validate : {
            validator : Number.isInteger,
            message   : 'Size must be an integer value'
        }
    },
});

// if room is removed
// RoomSchema.pre('remove',async function(next){
//     console.log(`removed appointment from ${this._id}`);
//     await this.model('Appointment').deleteMany({room: this._id});
//     next();
// });

export const Room = mongoose.model('Room',RoomSchema);
