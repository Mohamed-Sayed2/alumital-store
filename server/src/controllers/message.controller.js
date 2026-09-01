import Message from "../models/message.model.js";
import { createNotification } from "../utils/notification.helper.js";

export const createMessage = async (req, res) => {
    try {
        const {
            fullName,
            phone,
            city,
            message,
        } = req.body;

        const newMessage = await Message.create({
            fullName,
            phone,
            city,
            message,
        });

        await createNotification({
            title: "رسالة جديدة",
            message: `رسالة جديدة من ${fullName}: ${message.slice(0, 40)}...`,
            type: "new_message",
            relatedId: newMessage._id,
            relatedType: "Message",
        });

        return res.status(201).json({
            message: "Message sent successfully",
            data: newMessage,
        });
    } catch (error) {
        console.error("Error creating message:", error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};


export const getMessages = async (req, res) => {
    try {
        const messages = await Message.find()
            .sort({ createdAt: -1 });

        return res.status(200).json({
            message: "Messages fetched successfully",
            count: messages.length,
            data: messages,
        });
    } catch (error) {
        console.error("Error fetching messages:", error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};


export const getMessageById = async (req, res) => {
    try {
        const { id } = req.params;

        const message = await Message.findById(id);

        if (!message) {
            return res.status(404).json({
                message: "Message not found",
            });
        }

        return res.status(200).json({
            message: "Message fetched successfully",
            data: message,
        });
    } catch (error) {
        console.error("Error fetching message:", error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};


export const markMessageAsRead = async (req, res) => {
    try {
        const { id } = req.params;

        const message = await Message.findByIdAndUpdate(
            id,
            {
                isRead: true,
            },
            {
                new: true,
            }
        );

        if (!message) {
            return res.status(404).json({
                message: "Message not found",
            });
        }

        return res.status(200).json({
            message: "Message marked as read",
            data: message,
        });
    } catch (error) {
        console.error("Error marking message as read:", error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};


export const deleteMessage = async (req, res) => {
    try {
        const { id } = req.params;

        const message = await Message.findByIdAndDelete(id);

        if (!message) {
            return res.status(404).json({
                message: "Message not found",
            });
        }

        return res.status(200).json({
            message: "Message deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting message:", error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};