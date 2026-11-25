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

        familyId: {
            type: String,
            required: true
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

refreshTokenSchema.index(
    { expiresAt: 1 },
    { expireAfterSeconds: 0 }
);

refreshTokenSchema.index({
    user: 1,
    revokedAt: 1
});

refreshTokenSchema.index({
    familyId: 1,
    revokedAt: 1
});

const RefreshToken = mongoose.model(
    "RefreshToken",
    refreshTokenSchema
);

export default RefreshToken;