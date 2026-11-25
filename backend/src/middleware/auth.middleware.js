import mongoose from "mongoose";

import User from "../modules/users/user.model.js";
import ApiError from "../utils/ApiError.js";

import {
    verifyAccessToken
} from "../utils/token.js";

export const protect = async (req, res, next) => {

    try {

        const authorization = req.headers.authorization;

        if (!authorization) {
            throw new ApiError(
                401,
                "Access token is required"
            );
        }

        const match = authorization.match(
            /^Bearer\s+(\S+)$/i
        );

        if (!match) {
            throw new ApiError(
                401,
                "Invalid authorization format"
            );
        }

        const token = match[1];

        let decoded;

        try {

            decoded = verifyAccessToken(token);

        } catch (error) {

            if (error.name === "TokenExpiredError") {
                throw new ApiError(
                    401,
                    "Access token has expired"
                );
            }

            throw new ApiError(
                401,
                "Invalid access token"
            );
        }

        if (
            typeof decoded.sub !== "string" ||
            !mongoose.isObjectIdOrHexString(decoded.sub)
        ) {
            throw new ApiError(
                401,
                "Invalid token subject"
            );
        }

        const user = await User.findById(decoded.sub);

        if (!user) {
            throw new ApiError(
                401,
                "User no longer exists"
            );
        }

        if (!user.isActive) {
            throw new ApiError(
                403,
                "Account is inactive"
            );
        }

        req.user = user;

        next();

    } catch (error) {
        next(error);
    }

};