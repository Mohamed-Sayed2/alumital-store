import { Schema, model } from "mongoose";

const messageSchema = new Schema(
    {
        fullName: { type: String, required: true,trim: true },
        phone: { type: String, required: true },
        city: { type: String, required: true,trim: true },
        message: { type: String, required: true },
        isRead: { type: Boolean, default: false },
    },
    { timestamps: true }
)
const Message = model("Message", messageSchema);
export default Message;