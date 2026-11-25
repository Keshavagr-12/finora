import { Router } from "express";

import { protect } from "../../middleware/auth.middleware.js";

import ApiResponse from "../../utils/ApiResponse.js";

import {
    register,
    login,
    refresh
} from "./auth.controller.js";

import {
    registerLimiter,
    loginLimiter,
    refreshLimiter
} from "../../middleware/rateLimit.middleware.js";


import {
    verifyOrigin
} from "../../middleware/csrf.middleware.js";


const router = Router();

router.post(
    "/refresh",
    verifyOrigin,
    refreshLimiter,
    refresh
);

router.post(
    "/login",
    verifyOrigin,
    loginLimiter,
    login
);

router.get("/protected-test", protect, (req, res) => {

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                userId: req.user._id,
                email: req.user.email,
                role: req.user.role
            },
            "Protected route accessed successfully"
        )
    );

});

export default router;