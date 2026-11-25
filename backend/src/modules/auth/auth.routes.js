import { Router } from "express";

import {
    register,
    login,
    refresh,
    logout,
    logoutAll,
    getMe
} from "./auth.controller.js";

import {
    registerLimiter,
    loginLimiter,
    refreshLimiter
} from "../../middleware/rateLimit.middleware.js";

import {
    protect
} from "../../middleware/auth.middleware.js";

import {
    verifyOrigin
} from "../../middleware/csrf.middleware.js";


import {
    authorize
} from "../../middleware/role.middleware.js";

import ApiResponse from "../../utils/ApiResponse.js";

const router = Router();

router.post(
    "/register",
    registerLimiter,
    register
);

router.post(
    "/login",
    verifyOrigin,
    loginLimiter,
    login
);

router.post(
    "/refresh",
    verifyOrigin,
    refreshLimiter,
    refresh
);

router.post(
    "/logout",
    verifyOrigin,
    logout
);

router.post(
    "/logout-all",
    verifyOrigin,
    protect,
    logoutAll
);

router.get(
    "/me",
    protect,
    getMe
);

router.get(
    "/admin-test",
    protect,
    authorize("admin"),
    (req, res) => {

        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    userId: req.user._id,
                    role: req.user.role
                },
                "Administrator access granted"
            )
        );

    }
);


export default router;