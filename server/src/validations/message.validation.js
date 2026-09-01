import { z } from "zod";

export const createMessageSchema = z.object({
    fullName: z
        .string()
        .min(2, "Full name must be at least 2 characters")
        .max(100, "Full name is too long"),

    phone: z
        .string()
        .min(8, "Phone number is invalid")
        .max(20, "Phone number is invalid"),

    city: z
        .string()
        .min(2, "City is required")
        .max(100, "City name is too long"),

    message: z
        .string()
        .min(5, "Message must be at least 5 characters")
        .max(2000, "Message is too long"),
});