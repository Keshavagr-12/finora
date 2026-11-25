import rateLimit from "express-rate-limit";

export const registerLimiter = rateLimit({

    windowMs: 15 * 60 * 1000,

    limit: 10,

    standardHeaders: "draft-7",

    legacyHeaders: false,

    message: {
        success: false,
        statusCode: 429,
        message: "Too many registration attempts. Try again later.",
        errors: []
    }

});

export const loginLimiter = rateLimit({

    windowMs: 15 * 60 * 1000,

    limit: 10,

    standardHeaders: "draft-7",

    legacyHeaders: false,

    skipSuccessfulRequests: true,

    message: {
        success: false,
        statusCode: 429,
        message: "Too many login attempts. Try again later.",
        errors: []
    }

});