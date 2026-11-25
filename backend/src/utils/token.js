import jwt from "jsonwebtoken";
import crypto from "crypto";

import { env } from "../config/env.js";
import RefreshToken from "../modules/auth/refreshToken.model.js";

// Generate JWT access token
export const generateAccessToken = (user) => {

    return jwt.sign(
        {
            role: user.role
        },
        env.JWT_ACCESS_SECRET,
        {
            subject: user._id.toString(),
            expiresIn: env.JWT_ACCESS_EXPIRY,
            issuer: "finora-api",
            audience: "finora-client"
        }
    );
};

// Generate opaque refresh token
export const generateRefreshToken = () => {

    return crypto.randomBytes(64).toString("hex");

};

// Hash refresh token
export const hashToken = (token) => {

    return crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

};

// Create access and refresh token pair
export const createTokenPair = async (user) => {

    const accessToken = generateAccessToken(user);

    const refreshToken = generateRefreshToken();

    const tokenHash = hashToken(refreshToken);

    const expiresAt = new Date(
        Date.now() +
        env.REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000
    );

    await RefreshToken.create({
        user: user._id,
        tokenHash,
        expiresAt
    });

    return {
        accessToken,
        refreshToken,
        refreshTokenExpiresAt: expiresAt
    };

};