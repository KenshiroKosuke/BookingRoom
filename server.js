import express from 'express';
import { config } from 'dotenv';
import { router as auth} from "./routes/auth.js"
import { router as room} from "./routes/room.js"
import { router as booking} from "./routes/booking.js"
import { connectDB } from './config/db.js';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import hpp from 'hpp';

config({ path: './config/config.env' });

connectDB();

const app = express();

app.use(helmet())
app.use(hpp());

// Route 
app.use(express.json())
app.use(cookieParser());
app.use('/api/v1/auth', auth);
app.use('/api/v1/rooms', room);
app.use('/api/v1/bookings', booking);
app.get('/', (req, res) => {
    res.send(`<h1>Hello from express</h1>`);
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`))

// Handle unhandled promise rejection
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    // Close server and exit process
    server.close(() => process.exit(1));
})