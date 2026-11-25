import User from "../users/user.model.js";

import ApiError from "../../utils/ApiError.js";
import { hashPassword } from "../../utils/password.js";

import { comparePassword } from "../../utils/password.js";
import { createTokenPair } from "../../utils/token.js";

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