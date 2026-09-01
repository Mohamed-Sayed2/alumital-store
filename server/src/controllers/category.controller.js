import mongoose from "mongoose";
import Category from "../models/category.model.js";
import Product from "../models/product.model.js";
import { createNotification } from "../utils/notification.helper.js";

export const createCategory = async (req, res) => {
    const { name } = req.body;
    try {
        if (!name || typeof name !== "string") {
            return res.status(400).json({ message: "Category name is required" });
        }
        const trimmedName = name.trim();
        const existCategory = await Category.findOne({ name: trimmedName });
        if (existCategory) {
            return res.status(409).json({ message: "Category already exist" });
        }
        const newCategory = await Category.create({ name: trimmedName });

        await createNotification({
            title: "تصنيف جديد",
            message: `تم إنشاء تصنيف جديد: ${newCategory.name}`,
            type: "category_created",
            relatedId: newCategory._id,
            relatedType: "Category",
        });

        return res.status(201).json({ message: "Category created successfully", category: newCategory });
    } catch (error) {
        console.error("Error creating category:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getCategories = async (req, res) => {
    try {
        const categories = await Category.find().sort({ createdAt: -1 });

        return res.status(200).json({
            message: "Categories fetched successfully",
            categories,
        });
    } catch (error) {
        console.error("Error fetching categories:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid category ID format" });
        }

        const category = await Category.findById(id);

        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        return res.status(200).json({
            message: "Category fetched successfully",
            category,
        });
    } catch (error) {
        console.error("Error fetching category:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid category ID format" });
        }

        const { name } = req.body;
        const updateData = {};

        if (name !== undefined) {
            const trimmedName = name.trim();
            const duplicate = await Category.findOne({ name: trimmedName, _id: { $ne: id } });
            if (duplicate) {
                return res.status(409).json({ message: "Category name already exists" });
            }
            updateData.name = trimmedName;
        }

        const category = await Category.findByIdAndUpdate(
            id,
            updateData,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        await createNotification({
            title: "تحديث تصنيف",
            message: `تم تعديل اسم التصنيف إلى: ${category.name}`,
            type: "category_updated",
            relatedId: category._id,
            relatedType: "Category",
        });

        return res.status(200).json({
            message: "Category updated successfully",
            category,
        });
    } catch (error) {
        console.error("Error updating category:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid category ID format" });
        }

        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        const productsCount = await Product.countDocuments({ category: id });
        if (productsCount > 0) {
            return res.status(409).json({
                message: "Cannot delete category because it contains existing products",
            });
        }

        const deletedName = category.name;
        await Category.findByIdAndDelete(id);

        await createNotification({
            title: "حذف تصنيف",
            message: `تم حذف التصنيف: ${deletedName}`,
            type: "category_deleted",
            relatedId: id,
            relatedType: "Category",
        });

        return res.status(200).json({
            message: "Category deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting category:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};