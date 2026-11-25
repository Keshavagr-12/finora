import { ZodError } from "zod";
import { env } from "../config/env.js";

const errorHandler = (err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    let statusCode = err.statusCode || err.status || 500;
    let message = err.message || "Internal server error";
    let errors = err.errors || [];

    // Zod validation errors
    if (err instanceof ZodError) {
        statusCode = 400;
        message = "Validation failed";

        errors = err.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message
        }));
    }

    // Mongoose validation errors
    if (err.name === "ValidationError") {
        statusCode = 400;
        message = "Database validation failed";

        errors = Object.values(err.errors).map((error) => ({
            field: error.path,
            message: error.message
        }));
    }

    // Invalid MongoDB ObjectId
    if (err.name === "CastError") {
        statusCode = 400;
        message = "Invalid resource identifier";
    }

    // MongoDB duplicate key error
    if (err.code === 11000) {
        statusCode = 409;
        message = "Resource already exists";
    }

    if (statusCode >= 500) {
        console.error(err);

        if (env.NODE_ENV === "production") {
            message = "Internal server error";
            errors = [];
        }
    }

    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
        errors,
        ...(env.NODE_ENV === "development" && {
            stack: err.stack
        })
    });
};

export default errorHandler;