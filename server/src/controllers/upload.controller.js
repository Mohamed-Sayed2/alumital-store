import { uploadStreamToCloudinary } from "../config/cloudinary.js";

export const uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: "يرجى اختيار صورة للرفع",
            });
        }

        const result = await uploadStreamToCloudinary(req.file.buffer, {
            folder: "alumital_store/products",
        });

        if (!result || !result.secure_url) {
            throw new Error("لم يتم استلام رابط آمن من Cloudinary");
        }

        return res.status(200).json({
            message: "تم رفع الصورة بنجاح",
            url: result.secure_url,
            public_id: result.public_id,
        });
    } catch (error) {
        console.error("Upload to Cloudinary error:", error?.message || error);
        return res.status(500).json({
            message: "حدث خطأ أثناء رفع الصورة إلى السحابة",
        });
    }
};
