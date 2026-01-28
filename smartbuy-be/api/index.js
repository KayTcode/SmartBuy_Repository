import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import httpErrors from 'http-errors';
import dotenv from 'dotenv';
import connectDb from '../config/db.js';
import apiRoutes from '../routes/index.js';

dotenv.config();

const app = express();

// Connect to database
connectDb();

// CORS configuration
const corsOptions = {
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Root endpoint
app.get("/", (req, res) => {
    res.status(200).json({ 
        success: true,
        message: "Welcome to SmartBuy API Server",
        version: "1.0.0",
        documentation: "/api/health"
    });
});

// API Routes
app.use("/api", apiRoutes);

// 404 Handler
app.use((req, res, next) => {
    next(httpErrors.NotFound("Route not found"));
});

// Error Handler
app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        success: false,
        error: {
            status: err.status || 500,
            message: err.message || "Internal Server Error"
        }
    });
});

// Export for Vercel
export default app;

// For local development
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 9999;
    app.listen(PORT, () => {
        console.log(`Server running at: http://localhost:${PORT}`);
    });
}
