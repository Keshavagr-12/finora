
import {
    registerSchema,
    loginSchema
} from "./auth.validation.js";

import {
    registerUser,
    loginUser
} from "./auth.service.js";

import ApiResponse from "../../utils/ApiResponse.js";

import {
    setRefreshTokenCookie
} from "../../utils/cookie.js";

export const register = async (req, res, next) => {

    try {

        const validatedData = registerSchema.parse(req.body);

        const user = await registerUser(validatedData);

        return res.status(201).json(
            new ApiResponse(
                201,
                user,
                "User registered successfully"
            )
        );

    } catch (error) {
        next(error);
    }
};

export const login = async (req, res, next) => {

    try {

        const validatedData = loginSchema.parse(req.body);

        const {
            user,
            accessToken,
            refreshToken
        } = await loginUser(validatedData);

        setRefreshTokenCookie(res, refreshToken);

        res.set("Cache-Control", "no-store");

        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    user,
                    accessToken
                },
                "Login successful"
            )
        );

    } catch (error) {
        next(error);
    }
};