import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 100
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            maxlength: 254,
            match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        },

        passwordHash: {
            type: String,
            required: true,
            select: false
        },

        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user"
        },

        currency: {
            type: String,
            enum: ["INR"],
            default: "INR"
        },

        timezone: {
            type: String,
            default: "Asia/Kolkata",
            validate: {
                validator: function (value) {
                    try {
                        new Intl.DateTimeFormat("en-IN", {
                            timeZone: value
                        });

                        return true;
                    } catch {
                        return false;
                    }
                },
                message: "Invalid timezone"
            }
        },

        isEmailVerified: {
            type: Boolean,
            default: false
        },

        isActive: {
            type: Boolean,
            default: true
        },

        lastLoginAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true,

        toJSON: {
            transform: function (doc, ret) {
                delete ret.passwordHash;
                delete ret.__v;

                return ret;
            }
        }
    }
);

const User = mongoose.model("User", userSchema);

export default User;