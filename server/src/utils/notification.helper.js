import Notification from "../models/notification.model.js";

export const createNotification = async ({
    title,
    message,
    type,
    relatedId = null,
    relatedType = null,
}) => {
    try {
        const notification = await Notification.create({
            title,
            message,
            type,
            relatedId: relatedId ? String(relatedId) : null,
            relatedType,
            isRead: false,
        });
        return notification;
    } catch (error) {
        console.error("Error creating notification helper:", error);
        return null;
    }
};
