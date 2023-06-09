import mongoose from "mongoose";

export const connectDB = async() => {
    mongoose.set('strictQuery',true);
    const conn = await mongoose.connect(process.env.MONGO_URI)
    console.log(`connect to MongoDB: ${conn.connection.host}`)
}