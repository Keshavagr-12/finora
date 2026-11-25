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

export default router;