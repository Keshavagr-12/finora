import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

import { env } from "./config/env.js";

import ApiResponse from "./utils/ApiResponse.js";
import ApiError from "./utils/ApiError.js";

import authRoutes from "./modules/auth/auth.routes.js";
import aiRoutes from "./modules/ai/ai.routes.js";

import errorHandler from "./middleware/error.middleware.js";
import notFound from "./middleware/notFound.middleware.js";

const app = express();

// Security middleware
app.use(helmet());

app.use(cors({
    origin: env.CLIENT_URL,
    credentials: true
}));

// Request parsing
app.use(express.json({ limit: "1mb" }));

app.use(express.urlencoded({
    extended: true,
    limit: "1mb"
}));

app.use(cookieParser());

// Request logging
if (env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

// Health endpoint
app.get("/api/v1/health", (req, res) => {
    const isDBConnected =
        mongoose.connection.readyState === 1;

    if (!isDBConnected) {
        throw new ApiError(
            503,
            "Database unavailable"
        );
    }

    res.status(200).json(
        new ApiResponse(
            200,
            {
                service: "FINORA Backend",
                status: "healthy",
                database: "connected",
                timestamp: new Date().toISOString()
            },
            "Service is healthy"
        )
    );
});

// Module routes
app.use("/api/v1/ai", aiRoutes);
app.use("/api/v1/auth", authRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

export default app;