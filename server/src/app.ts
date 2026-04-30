import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

import { ErrorHandler } from './web/middlewares/ErrorHandler.js';
import authRoutes from './web/routes/auth.routes.js';
import pdfRoutes from './web/routes/pdf.routes.js';

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

app.use('/api/auth', authRoutes);
app.use('/api/pdf', pdfRoutes);

const PORT = process.env.PORT || 4000

app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

app.use(ErrorHandler);
