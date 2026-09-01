import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

/**
 * Upload an in-memory buffer to Cloudinary using upload_stream
 * @param {Buffer} fileBuffer - File buffer from Multer memoryStorage
 * @param {Object} options - Additional Cloudinary upload options
 * @returns {Promise<Object>} Cloudinary upload result
 */
export const uploadStreamToCloudinary = (fileBuffer, options = {}) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: "alumital_store/products",
                resource_type: "image",
                ...options,
            },
            (error, result) => {
                if (error) {
                    return reject(error);
                }
                resolve(result);
            }
        );
        uploadStream.end(fileBuffer);
    });
};

/**
 * Safely delete an image from Cloudinary given its secure_url
 * @param {string} imageUrl - The full Cloudinary URL
 * @returns {Promise<void>}
 */
export const deleteCloudinaryImageByUrl = async (imageUrl) => {
    try {
        if (!imageUrl || typeof imageUrl !== "string") return;

        const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
        // Verify it is a Cloudinary URL and belongs to this project's cloud
        if (!imageUrl.includes("res.cloudinary.com") || (cloudName && !imageUrl.includes(cloudName))) {
            return;
        }

        const uploadIndex = imageUrl.indexOf("/upload/");
        if (uploadIndex === -1) return;

        let pathAfterUpload = imageUrl.substring(uploadIndex + 8); // remove "/upload/"
        
        // Remove version prefix if present (e.g. v1740000000/)
        pathAfterUpload = pathAfterUpload.replace(/^v\d+\//, "");

        // Remove file extension (e.g. .jpg, .png, .webp)
        const lastDotIndex = pathAfterUpload.lastIndexOf(".");
        const publicId = lastDotIndex !== -1 ? pathAfterUpload.substring(0, lastDotIndex) : pathAfterUpload;

        if (publicId) {
            await cloudinary.uploader.destroy(publicId);
        }
    } catch (error) {
        // Log warning without failing caller workflow
        console.warn("Failed to delete old Cloudinary image asset:", error?.message || error);
    }
};

export default cloudinary;
