import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import mongoose from "mongoose";

const app = express();

// Global middleware
app.use(helmet());

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

// Health check API
app.get("/api/v1/health", (req, res) => {
    const isDBConnected =
        mongoose.connection.readyState === 1;

    res.status(isDBConnected ? 200 : 503).json({
        success: isDBConnected,
        service: "FINORA Backend",
        status: isDBConnected ? "healthy" : "unhealthy",
        database: isDBConnected
            ? "connected"
            : "disconnected",
        timestamp: new Date().toISOString()
    });
});

export default app;