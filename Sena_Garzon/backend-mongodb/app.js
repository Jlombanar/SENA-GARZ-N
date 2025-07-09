// app.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import cursoRoutes from './routes/cursoRoutes.js'; // ← corregido

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', authRoutes);
app.use('/api/curso', cursoRoutes); // ← corregido
app.use('/uploads', express.static('uploads'));

export default app;
