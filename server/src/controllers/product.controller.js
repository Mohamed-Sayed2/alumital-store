import mongoose from "mongoose";
import Product from "../models/product.model.js";
import Category from "../models/category.model.js";
import { createNotification } from "../utils/notification.helper.js";
import { deleteCloudinaryImageByUrl } from "../config/cloudinary.js";

export const createProduct = async (req, res) => {
    try {
        const {
            name,
            description,
            image,
            material,
            category,
            features,
            isVisible = true,
        } = req.body;

        if (!mongoose.Types.ObjectId.isValid(category)) {
            return res.status(400).json({
                message: "Invalid category ID format",
            });
        }

        const categoryExists = await Category.findById(category);

        if (!categoryExists) {
            return res.status(404).json({
                message: "Category not found",
            });
        }

        let product = await Product.create({
            name,
            description,
            image,
            material,
            category,
            features: features || [],
            isVisible,
        });

        product = await product.populate("category", "name");

        await createNotification({
            title: "منتج جديد",
            message: `تم إضافة منتج جديد: ${product.name}`,
            type: "new_product",
            relatedId: product._id,
            relatedType: "Product",
        });

        return res.status(201).json({
            message: "Product created successfully",
            product,
        });
    } catch (error) {
        console.error("Error creating product:", error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

export const getProducts = async (req, res) => {
    try {
        const { category } = req.query;

        const filter = {};

        // Only filter visible products if request is NOT from authenticated Admin
        if (!req.admin) {
            filter.isVisible = true;
        }

        if (category) {
            if (!mongoose.Types.ObjectId.isValid(category)) {
                return res.status(400).json({
                    message: "Invalid category ID format",
                });
            }

            const categoryExists = await Category.findById(category);

            if (!categoryExists) {
                return res.status(404).json({
                    message: "Category not found",
                });
            }

            filter.category = category;
        }

        const products = await Product.find(filter)
            .populate("category", "name")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            message: "Products fetched successfully",
            count: products.length,
            products,
        });
    } catch (error) {
        console.error("Error fetching products:", error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid product ID format",
            });
        }

        const product = await Product.findById(id)
            .populate("category", "name");

        if (!product) {
            return res.status(404).json({
                message: "Product not found",
            });
        }

        // If client (non-admin), check visibility
        if (!req.admin && !product.isVisible) {
            return res.status(404).json({
                message: "Product not found",
            });
        }

        return res.status(200).json({
            message: "Product fetched successfully",
            product,
        });
    } catch (error) {
        console.error("Error fetching product:", error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid product ID format",
            });
        }

        const existingProduct = await Product.findById(id);
        if (!existingProduct) {
            return res.status(404).json({
                message: "Product not found",
            });
        }

        const {
            name,
            description,
            image,
            material,
            category,
            features,
            isVisible,
        } = req.body;

        const updateData = {};

        if (name !== undefined) updateData.name = name;
        if (description !== undefined) updateData.description = description;
        if (image !== undefined) updateData.image = image;
        if (material !== undefined) updateData.material = material;
        if (features !== undefined) updateData.features = features;
        if (isVisible !== undefined) updateData.isVisible = isVisible;

        if (category !== undefined) {
            if (!mongoose.Types.ObjectId.isValid(category)) {
                return res.status(400).json({
                    message: "Invalid category ID format",
                });
            }

            const categoryExists = await Category.findById(category);

            if (!categoryExists) {
                return res.status(404).json({
                    message: "Category not found",
                });
            }
            updateData.category = category;
        }

        // If image was changed, delete the old Cloudinary image asset
        const oldImage = existingProduct.image;
        if (image !== undefined && image !== oldImage) {
            await deleteCloudinaryImageByUrl(oldImage);
        }

        const product = await Product.findByIdAndUpdate(
            id,
            updateData,
            {
                new: true,
                runValidators: true,
            }
        ).populate("category", "name");

        await createNotification({
            title: "تحديث منتج",
            message: `تم تعديل بيانات المنتج: ${product.name}`,
            type: "product_updated",
            relatedId: product._id,
            relatedType: "Product",
        });

        return res.status(200).json({
            message: "Product updated successfully",
            product,
        });
    } catch (error) {
        console.error("Error updating product:", error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

export const updateProductVisibility = async (req, res) => {
    try {
        const { id } = req.params;
        const { isVisible } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid product ID format",
            });
        }

        if (typeof isVisible !== "boolean") {
            return res.status(400).json({
                message: "isVisible must be a boolean value",
            });
        }

        const product = await Product.findByIdAndUpdate(
            id,
            { isVisible },
            { new: true }
        ).populate("category", "name");

        if (!product) {
            return res.status(404).json({
                message: "Product not found",
            });
        }

        return res.status(200).json({
            message: `Product visibility updated to ${isVisible}`,
            product,
        });
    } catch (error) {
        console.error("Error updating product visibility:", error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid product ID format",
            });
        }

        const product = await Product.findByIdAndDelete(id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found",
            });
        }

        // Delete associated image from Cloudinary if applicable
        if (product.image) {
            await deleteCloudinaryImageByUrl(product.image);
        }

        return res.status(200).json({
            message: "Product deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting product:", error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};