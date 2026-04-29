import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

dotenv.config();
connectDB();

const app = express();

const allowedOrigin = process.env.CLIENT_URL;

app.use(cors({
    origin: allowedOrigin,
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


const PORT = process.env.PORT || 4000

app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
