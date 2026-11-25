import rateLimit from "express-rate-limit";

import { env } from "../config/env.js";

export const registerLimiter = rateLimit({

    windowMs: 15 * 60 * 1000,

    limit: 10,

    skip: () => env.NODE_ENV === "test",


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

    skip: () => env.NODE_ENV === "test",

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


export const refreshLimiter = rateLimit({

    windowMs: 15 * 60 * 1000,

    limit: 30,

skip: () => env.NODE_ENV === "test",

    standardHeaders: "draft-7",

    legacyHeaders: false,

    message: {
        success: false,
        statusCode: 429,
        message: "Too many refresh requests.",
        errors: []
    }

});