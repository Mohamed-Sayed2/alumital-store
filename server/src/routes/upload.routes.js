import express from "express";
import { uploadImage } from "../controllers/upload.controller.js";
import upload from "../middlewares/upload.middleware.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

// Admin protected: POST /api/upload
router.post(
    "/",
    authMiddleware,
    (req, res, next) => {
        upload.single("image")(req, res, (err) => {
            if (err) {
                return res.status(400).json({
                    message: err.message || "فشل رفع الملف",
                });
            }
            next();
        });
    },
    uploadImage
);

export default router;
