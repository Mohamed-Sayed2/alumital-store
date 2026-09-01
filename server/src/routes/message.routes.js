import express from "express";

import {
    createMessage,
    getMessages,
    getMessageById,
    markMessageAsRead,
    deleteMessage,
} from "../controllers/message.controller.js";

import { createMessageSchema } from "../validations/message.validation.js";

import validate from "../middlewares/validate.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import validateObjectId from "../middlewares/validateObjectId.js";

const router = express.Router();

// Public: Submit contact message
router.post(
    "/",
    validate(createMessageSchema),
    createMessage
);

// Admin Dashboard only: Protected routes
router.get("/", authMiddleware, getMessages);
router.get("/:id", authMiddleware, validateObjectId("id"), getMessageById);
router.patch("/:id/read", authMiddleware, validateObjectId("id"), markMessageAsRead);
router.delete("/:id", authMiddleware, validateObjectId("id"), deleteMessage);

export default router;