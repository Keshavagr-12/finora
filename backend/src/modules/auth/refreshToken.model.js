import mongoose from "mongoose";

const refreshTokenSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        tokenHash: {
            type: String,
            required: true,
            unique: true,
            select: false
        },

        expiresAt: {
            type: Date,
            required: true
        },

        revokedAt: {
            type: Date,
            default: null
        },

        replacedByTokenHash: {
            type: String,
            default: null,
            select: false
        }
    },
    {
        timestamps: true
    }
);

// Automatically remove expired sessions eventually
refreshTokenSchema.index(
    { expiresAt: 1 },
    { expireAfterSeconds: 0 }
);

// Find active sessions belonging to a user
refreshTokenSchema.index({
    user: 1,
    revokedAt: 1
});

const RefreshToken = mongoose.model(
    "RefreshToken",
    refreshTokenSchema
);

export default RefreshToken;