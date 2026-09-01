import express from "express";
import { getSettings, updateSettings } from "../controllers/settings.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

// Public: GET /api/settings
router.get("/", getSettings);

// Admin-only: PATCH /api/settings
router.patch("/", authMiddleware, updateSettings);

export default router;
