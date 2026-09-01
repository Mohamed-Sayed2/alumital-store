import dotenv from "dotenv";
dotenv.config();

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { uploadStreamToCloudinary, deleteCloudinaryImageByUrl } from "./src/config/cloudinary.js";
import connectDB from "./src/config/db.js";
import Product from "./src/models/product.model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Standard valid 1x1 transparent PNG buffer
const samplePngBuffer = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
    "base64"
);

async function testCloudinaryIntegration() {
    console.log("==================================================");
    console.log("TEST 1: Direct Cloudinary Upload via Stream");
    console.log("==================================================");

    const uploadRes = await uploadStreamToCloudinary(samplePngBuffer, {
        folder: "alumital_store/test",
    });

    console.log("Direct Upload Success!");
    console.log("Secure URL:", uploadRes.secure_url);
    console.log("Public ID:", uploadRes.public_id);
    console.log("Format:", uploadRes.format);

    if (!uploadRes.secure_url.startsWith("https://res.cloudinary.com/")) {
        throw new Error("URL is not a secure Cloudinary URL");
    }

    console.log("\n==================================================");
    console.log("TEST 2: Clean up test asset from Cloudinary");
    console.log("==================================================");
    await deleteCloudinaryImageByUrl(uploadRes.secure_url);
    console.log("Asset deletion completed without errors.");

    console.log("\n==================================================");
    console.log("TEST 3: Checking existing DB Products for localhost URLs");
    console.log("==================================================");
    await connectDB();
    const allProducts = await Product.find({}, "name image");
    const localhostProducts = allProducts.filter(p => p.image && p.image.includes("localhost"));
    const cloudinaryProducts = allProducts.filter(p => p.image && p.image.includes("res.cloudinary.com"));

    console.log(`Total Products: ${allProducts.length}`);
    console.log(`Products with Localhost URL: ${localhostProducts.length}`);
    console.log(`Products with Cloudinary URL: ${cloudinaryProducts.length}`);
    
    localhostProducts.forEach(p => {
        console.log(` - ID: ${p._id}, Name: "${p.name}", URL: ${p.image}`);
    });

    console.log("\n==================================================");
    console.log("ALL DIRECT CLOUDINARY CHECKS PASSED SUCCESSFULLY!");
    console.log("==================================================");
    process.exit(0);
}

testCloudinaryIntegration().catch((err) => {
    console.error("Test failed:", err);
    process.exit(1);
});
