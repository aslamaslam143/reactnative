import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import userRouter from './routes/userRoutes.js';
import dotenv from 'dotenv';
import fs from 'fs';

const app = express();
app.use(express.json());
dotenv.config();

// ✅ Serve static files from uploads folder
app.use('/uploads', express.static(path.resolve('uploads')));

// ✅ Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/chatdb')
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error:', err));

// ✅ Health check
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// ✅ User routes
app.use('/api/users', userRouter);

// ✅ Start server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});