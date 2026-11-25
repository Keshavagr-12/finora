import User from "../users/user.model.js";

import ApiError from "../../utils/ApiError.js";
import { hashPassword } from "../../utils/password.js";

import { comparePassword } from "../../utils/password.js";

import mongoose from "mongoose";

import RefreshToken from "./refreshToken.model.js";

import {
    createTokenPair,
    hashToken
} from "../../utils/token.js";

export const registerUser = async ({
    name,
    email,
    password
}) => {

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw new ApiError(
            409,
            "Email is already registered"
        );
    }

    const passwordHash = await hashPassword(password);

    const user = await User.create({
        name,
        email,
        passwordHash
    });

    return user.toJSON();
};

export const loginUser = async ({ email, password }) => {

    const user = await User.findOne({ email })
        .select("+passwordHash");

    if (!user) {
        throw new ApiError(
            401,
            "Invalid email or password"
        );
    }

    const isPasswordValid = await comparePassword(
        password,
        user.passwordHash
    );

    if (!isPasswordValid) {
        throw new ApiError(
            401,
            "Invalid email or password"
        );
    }

    if (!user.isActive) {
        throw new ApiError(
            403,
            "Account is inactive"
        );
    }

    user.lastLoginAt = new Date();

    await user.save();

    const tokens = await createTokenPair(user);

    return {
        user: user.toJSON(),
        ...tokens
    };
};

export const refreshSession = async (refreshToken) => {

    if (
        typeof refreshToken !== "string" ||
        !/^[a-f0-9]{128}$/.test(refreshToken)
    ) {
        throw new ApiError(
            401,
            "Invalid or missing refresh token"
        );
    }

    const tokenHash = hashToken(refreshToken);

    const session = await mongoose.startSession();

    try {

        const result = await session.withTransaction(
            async () => {

                const storedToken = await RefreshToken
                    .findOne({ tokenHash })
                    .session(session);

                if (!storedToken) {
                    return { error: "Invalid refresh token" };
                }

                const now = new Date();

                if (storedToken.expiresAt <= now) {
                    return { error: "Refresh token has expired" };
                }

                // Detect reuse of a previously rotated token
                if (storedToken.revokedAt) {

                    await RefreshToken.updateMany(
                        {
                            familyId: storedToken.familyId,
                            revokedAt: null
                        },
                        {
                            $set: { revokedAt: now }
                        },
                        { session }
                    );

                    return {
                        error: "Refresh token reuse detected. Please log in again."
                    };
                }

                const user = await User
                    .findById(storedToken.user)
                    .session(session);

                if (!user || !user.isActive) {

                    await RefreshToken.updateMany(
                        {
                            familyId: storedToken.familyId,
                            revokedAt: null
                        },
                        {
                            $set: { revokedAt: now }
                        },
                        { session }
                    );

                    return { error: "Account is unavailable" };
                }

                // Generate replacement tokens
                const tokens = await createTokenPair(
                    user,
                    {
                        familyId: storedToken.familyId,
                        session
                    }
                );

                // Revoke the previous refresh token
                storedToken.revokedAt = now;

                storedToken.replacedByTokenHash =
                    hashToken(tokens.refreshToken);

                await storedToken.save({ session });

                return { tokens };

            }
        );

        if (result.error) {
            throw new ApiError(401, result.error);
        }

        return result.tokens;

    } finally {
        await session.endSession();
    }

};

export const logoutUser = async (refreshToken) => {

    if (
        typeof refreshToken !== "string" ||
        !/^[a-f0-9]{128}$/.test(refreshToken)
    ) {
        return;
    }

    const tokenHash = hashToken(refreshToken);

    const storedToken = await RefreshToken.findOne({
        tokenHash
    });

    if (!storedToken || !storedToken.familyId) {
        return;
    }

    await RefreshToken.updateMany(
        {
            user: storedToken.user,
            familyId: storedToken.familyId,
            revokedAt: null
        },
        {
            $set: {
                revokedAt: new Date()
            }
        }
    );

};

export const logoutAllSessions = async (userId) => {

    await RefreshToken.updateMany(
        {
            user: userId,
            revokedAt: null
        },
        {
            $set: {
                revokedAt: new Date()
            }
        }
    );

};