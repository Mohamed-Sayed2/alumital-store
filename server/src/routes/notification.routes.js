import express from "express";
import {
    getNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
} from "../controllers/notification.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import validateObjectId from "../middlewares/validateObjectId.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getNotifications);
router.get("/unread-count", getUnreadCount);
router.patch("/read-all", markAllAsRead);
router.patch("/:id/read", validateObjectId("id"), markAsRead);
router.delete("/:id", validateObjectId("id"), deleteNotification);

export default router;
