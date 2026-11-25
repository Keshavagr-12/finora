import { env } from "../config/env.js";
import ApiError from "../utils/ApiError.js";

export const verifyOrigin = (req, res, next) => {

    const origin = req.get("Origin");

    const allowedOrigin =
        new URL(env.CLIENT_URL).origin;

    if (origin !== allowedOrigin) {
        return next(
            new ApiError(
                403,
                "Request origin is not allowed"
            )
        );
    }

    next();

};