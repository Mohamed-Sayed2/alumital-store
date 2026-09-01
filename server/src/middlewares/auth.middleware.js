import jwt from "jsonwebtoken";
import Admin from "../models/admin.model.js";

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Authentication required. Missing or invalid token format.",
            });
        }

        const token = authHeader.split(" ")[1];
        const secret = process.env.JWT_SECRET;

        if (!secret) {
            console.error("JWT_SECRET environment variable is missing.");
            return res.status(500).json({ message: "Internal server error" });
        }

        const decoded = jwt.verify(token, secret);

        const admin = await Admin.findById(decoded.id).select("-password");

        if (!admin) {
            return res.status(401).json({
                message: "Invalid token. Admin account not found.",
            });
        }

        req.admin = admin;
        next();
    } catch (error) {
        console.error("Authentication error:", error.message);
        return res.status(401).json({
            message: "Unauthorized access. Token is invalid or expired.",
        });
    }
};

export const optionalAuthMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith("Bearer ")) {
            const token = authHeader.split(" ")[1];
            const secret = process.env.JWT_SECRET;
            if (secret) {
                const decoded = jwt.verify(token, secret);
                const admin = await Admin.findById(decoded.id).select("-password");
                if (admin) {
                    req.admin = admin;
                }
            }
        }
    } catch (error) {
        // Silent catch for optional auth
    }
    next();
};

export default authMiddleware;

