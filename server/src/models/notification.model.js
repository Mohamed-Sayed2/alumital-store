import { Schema, model } from "mongoose";

const notificationSchema = new Schema(
    {
        title: { type: String, required: true, trim: true },
        message: { type: String, required: true, trim: true },
        type: {
            type: String,
            required: true,
            enum: [
                "new_message",
                "new_product",
                "product_updated",
                "category_created",
                "category_updated",
                "category_deleted",
                "system",
            ],
        },
        isRead: { type: Boolean, default: false },
        relatedId: { type: String },
        relatedType: { type: String },
    },
    { timestamps: true }
);

const Notification = model("Notification", notificationSchema);
export default Notification;
