import { Router } from "express";
import { checkAIHealth } from "./ai.controller.js";

const router = Router();

router.get("/health", checkAIHealth);

export default router;