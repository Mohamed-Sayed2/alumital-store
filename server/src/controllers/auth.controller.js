import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/admin.model.js";

export const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required",
            });
        }

        const secret = process.env.JWT_SECRET;
        if (!secret) {
            console.error("JWT_SECRET environment variable is missing.");
            return res.status(500).json({ message: "Internal server error" });
        }

        const admin = await Admin.findOne({ email: email.toLowerCase().trim() });

        if (!admin) {
            return res.status(401).json({
                message: "Invalid credentials",
            });
        }

        let isMatch = false;
        if (admin.password.startsWith("$2a$") || admin.password.startsWith("$2b$")) {
            isMatch = await bcrypt.compare(password, admin.password);
        } else {
            isMatch = (password === admin.password);
            if (isMatch) {
                admin.password = await bcrypt.hash(password, 10);
                await admin.save();
            }
        }

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid credentials",
            });
        }

        const token = jwt.sign(
            { id: admin._id, email: admin.email },
            secret,
            { expiresIn: "7d" }
        );

        return res.status(200).json({
            message: "Login successful",
            token,
            admin: {
                _id: admin._id,
                email: admin.email,
                createdAt: admin.createdAt,
            },
        });
    } catch (error) {
        console.error("Error during admin login:", error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};
