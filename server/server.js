import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import Product from './models/Product.js'; 
import productRoutes from './routes/productRoutes.js';
dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors({
    credentials: true,
    // origin: process.env.FRONTEND_URL,
    origin: "*",
}))
// Routes
app.use('/api/users', userRoutes);
app.use('/api/categories', productRoutes);
app.use('/api/products', productRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`.red);
    // Close server & exit process
    server.close(() => process.exit(1));
});