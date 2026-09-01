import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import categoryRoutes from "./routes/category.routes.js";
import productRoutes from "./routes/product.routes.js";
import messageRoutes from "./routes/message.routes.js";
import authRoutes from "./routes/auth.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import settingsRoutes from "./routes/settings.routes.js";
import aboutRoutes from "./routes/about.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Configure CORS using environment variables with local dev fallbacks
const clientUrls = (process.env.CLIENT_URL || "").split(",").map(url => url.trim()).filter(Boolean);
const adminUrls = (process.env.ADMIN_URL || "").split(",").map(url => url.trim()).filter(Boolean);

const allowedOrigins = [
    ...clientUrls,
    ...adminUrls,
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:5173",
    "http://localhost:5174",
];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
}));

app.use(express.json());

// Serve static uploads publicly
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", authRoutes); // Alias for compatibility
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/about", aboutRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
    return res.status(200).json({ status: "OK", message: "Server is healthy" });
});

// 404 Handler
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error("Global Error Handler caught:", err);
    res.status(err.status || 500).json({
        message: err.message || "Internal server error",
    });
});

export default app;