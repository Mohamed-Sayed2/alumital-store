import { z } from "zod";

export const createProductSchema = z.object({
    name: z
        .string()
        .min(2, "Product name must be at least 2 characters")
        .max(100, "Product name is too long"),

    description: z
        .string()
        .min(5, "Description must be at least 5 characters"),

    image: z
        .string()
        .min(1, "Image is required"),

    material: z
        .string()
        .min(2, "Material is required"),

    category: z
        .string()
        .min(1, "Category is required"),

    features: z
        .array(z.string())
        .optional(),
});

export const updateProductSchema = createProductSchema.partial();