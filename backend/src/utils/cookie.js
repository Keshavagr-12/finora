import { env } from "../config/env.js";

const COOKIE_NAME = "finoraRefreshToken";

const cookieOptions = {
    httpOnly: true,

    secure: env.NODE_ENV === "production",

    sameSite: "lax",

    path: "/api/v1/auth"
};

// Set refresh token cookie
export const setRefreshTokenCookie = (res, token) => {

    res.cookie(
        COOKIE_NAME,
        token,
        {
            ...cookieOptions,

            maxAge:
                env.REFRESH_TOKEN_EXPIRY_DAYS *
                24 *
                60 *
                60 *
                1000
        }
    );

};

// Clear refresh token cookie
export const clearRefreshTokenCookie = (res) => {

    res.clearCookie(
        COOKIE_NAME,
        cookieOptions
    );

};