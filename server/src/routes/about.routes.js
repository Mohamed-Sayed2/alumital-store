import express from "express";
import { getAbout, updateAbout } from "../controllers/about.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

// Public: GET /api/about
router.get("/", getAbout);

// Admin-only: PATCH /api/about
router.patch("/", authMiddleware, updateAbout);

export default router;
