import express from "express";
import {
    createCategory,
    getCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
} from "../controllers/category.controller.js";
import { createCategorySchema } from "../validations/category.validation.js";
import validate from "../middlewares/validate.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import validateObjectId from "../middlewares/validateObjectId.js";

const router = express.Router();

// Public routes
router.get("/", getCategories);
router.get("/:id", validateObjectId("id"), getCategoryById);

// Admin-only routes
router.post("/", authMiddleware, validate(createCategorySchema), createCategory);
router.patch("/:id", authMiddleware, validateObjectId("id"), updateCategory);
router.delete("/:id", authMiddleware, validateObjectId("id"), deleteCategory);

export default router;