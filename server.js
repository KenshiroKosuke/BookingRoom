import express from 'express';
import { config } from 'dotenv';
import { router as auth} from "./routes/auth.js"
import { connectDB } from './config/db.js';

config({ path: './config/config.env' });

connectDB();

const app = express();

// Route 
app.use(express.json())
app.use('/api/v1/auth', auth);
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