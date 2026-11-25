import mongoose from "mongoose";

import { env } from "../src/config/env.js";
import User from "../src/modules/users/user.model.js";

import {
    hashPassword,
    comparePassword
} from "../src/utils/password.js";

const testUserModel = async () => {
    let userId;

    try {
        await mongoose.connect(env.MONGO_URI);

        await User.init();

        const password = "Finora@Test123";
        const passwordHash = await hashPassword(password);

        const user = await User.create({
            name: "Test User",
            email: `test-${Date.now()}@example.com`,
            passwordHash
        });

        userId = user._id;

        console.log("User created:", user.toJSON());

        const savedUser = await User.findById(userId)
            .select("+passwordHash");

        const isMatch = await comparePassword(
            password,
            savedUser.passwordHash
        );

        console.log("Password matched:", isMatch);

        const publicUser = await User.findById(userId);

        console.log(
            "Password hidden:",
            publicUser.passwordHash === undefined
        );

    } catch (error) {
        console.error(error.message);
        process.exitCode = 1;

    } finally {
        if (userId) {
            await User.deleteOne({ _id: userId });
        }

        await mongoose.disconnect();
    }
};

testUserModel();