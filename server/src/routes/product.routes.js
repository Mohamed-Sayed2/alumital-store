import express from "express";

import {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    updateProductVisibility,
    deleteProduct,
} from "../controllers/product.controller.js";

import { createProductSchema, updateProductSchema } from "../validations/product.validation.js";

import validate from "../middlewares/validate.js";
import authMiddleware, { optionalAuthMiddleware } from "../middlewares/auth.middleware.js";
import validateObjectId from "../middlewares/validateObjectId.js";

const router = express.Router();

// Public routes with optional auth check (for admin visibility)
router.get("/", optionalAuthMiddleware, getProducts);
router.get("/:id", validateObjectId("id"), optionalAuthMiddleware, getProductById);

// Admin-only routes
router.post(
    "/",
    authMiddleware,
    validate(createProductSchema),
    createProduct
);
router.patch(
    "/:id/visibility",
    authMiddleware,
    validateObjectId("id"),
    updateProductVisibility
);
router.patch(
    "/:id",
    authMiddleware,
    validateObjectId("id"),
    validate(updateProductSchema),
    updateProduct
);
router.delete("/:id", authMiddleware, validateObjectId("id"), deleteProduct);

export default router;