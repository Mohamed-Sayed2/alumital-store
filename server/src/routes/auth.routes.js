import express from "express";
import { adminLogin } from "../controllers/auth.controller.js";
import { loginSchema } from "../validations/auth.validation.js";
import validate from "../middlewares/validate.js";

const router = express.Router();

// Public: POST /api/auth/login
router.post("/login", validate(loginSchema), adminLogin);

export default router;
