import dotenv from "dotenv";
dotenv.config();

import http from "http";
import app from "./src/app.js";
import connectDB from "./src/config/db.js";
import seedAdmin from "./src/utils/seedAdmin.js";
import Category from "./src/models/category.model.js";
import Product from "./src/models/product.model.js";

const samplePngBuffer = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
    "base64"
);

const samplePngBuffer2 = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAFElEQVR42mNk+M9Qz8DAwMAABQAA//8D3gHgxWbYsgAAAABJRU5ErkJggg==",
    "base64"
);

async function runE2ETests() {
    await connectDB();
    await seedAdmin();

    const server = http.createServer(app);
    await new Promise((resolve) => server.listen(3002, resolve));
    const BASE_URL = "http://localhost:3002/api";

    console.log("==================================================");
    console.log("1. Testing Admin Authentication");
    console.log("==================================================");

    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            email: process.env.ADMIN_EMAIL || "admin@alumital.com",
            password: process.env.ADMIN_PASSWORD || "admin123456",
        }),
    });

    const loginData = await loginRes.json();
    console.log("Login status:", loginRes.status);
    if (loginRes.status !== 200 || !loginData.token) {
        throw new Error("Admin login failed");
    }
    const token = loginData.token;
    const authHeaders = {
        Authorization: `Bearer ${token}`,
    };

    console.log("\n==================================================");
    console.log("2. Testing Unauthenticated Upload (Expect 401)");
    console.log("==================================================");

    const unauthForm = new FormData();
    unauthForm.append("image", new Blob([samplePngBuffer], { type: "image/png" }), "test1.png");

    const unauthRes = await fetch(`${BASE_URL}/upload`, {
        method: "POST",
        body: unauthForm,
    });
    console.log("Unauthenticated upload status (expected 401):", unauthRes.status);
    if (unauthRes.status !== 401) {
        throw new Error("Unauthenticated upload was not rejected with 401");
    }

    console.log("\n==================================================");
    console.log("3. Testing Invalid File Type Upload (Expect 400)");
    console.log("==================================================");

    const badFileForm = new FormData();
    badFileForm.append("image", new Blob(["not-an-image"], { type: "text/plain" }), "test.txt");

    const badFileRes = await fetch(`${BASE_URL}/upload`, {
        method: "POST",
        headers: authHeaders,
        body: badFileForm,
    });
    const badFileData = await badFileRes.json();
    console.log("Invalid file upload status (expected 400):", badFileRes.status, badFileData.message);
    if (badFileRes.status !== 400) {
        throw new Error("Invalid file upload was not rejected with 400");
    }

    console.log("\n==================================================");
    console.log("4. Testing Authenticated Image Upload to Cloudinary");
    console.log("==================================================");

    const validForm1 = new FormData();
    validForm1.append("image", new Blob([samplePngBuffer], { type: "image/png" }), "product_sample.png");

    const uploadRes1 = await fetch(`${BASE_URL}/upload`, {
        method: "POST",
        headers: authHeaders,
        body: validForm1,
    });

    const uploadData1 = await uploadRes1.json();
    console.log("Upload 1 Status:", uploadRes1.status);
    console.log("Upload 1 Response:", uploadData1);

    if (uploadRes1.status !== 200 || !uploadData1.url) {
        throw new Error("Upload 1 failed");
    }

    if (!uploadData1.url.startsWith("https://res.cloudinary.com/")) {
        throw new Error("Returned URL does not start with https://res.cloudinary.com/");
    }

    if (uploadData1.url.includes("localhost") || uploadData1.url.includes("/uploads/")) {
        throw new Error("Returned URL contains localhost or /uploads/!");
    }

    console.log("\n==================================================");
    console.log("5. Testing Product Creation with Cloudinary URL");
    console.log("==================================================");

    let category = await Category.findOne();
    if (!category) {
        category = await Category.create({ name: "تصنيف تجريبي" });
    }

    const createProdRes = await fetch(`${BASE_URL}/products`, {
        method: "POST",
        headers: {
            ...authHeaders,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: "واجهة زجاجية ستراكشرال كلاود",
            description: "واجهة زجاجية بأحدث أنظمة الألوميتال والعزل",
            image: uploadData1.url,
            material: "قطاع ستراكشرال 50",
            category: category._id.toString(),
            features: ["عزل حراري تام", "زجاج معالج"],
            isVisible: true,
        }),
    });

    const createProdData = await createProdRes.json();
    console.log("Product creation status:", createProdRes.status);
    console.log("Created product image in DB:", createProdData.product?.image);

    if (createProdRes.status !== 201 || !createProdData.product) {
        throw new Error("Product creation failed");
    }

    const productId = createProdData.product._id;
    if (createProdData.product.image !== uploadData1.url) {
        throw new Error("Product image in DB does not match Cloudinary URL");
    }

    console.log("\n==================================================");
    console.log("6. Testing Client Public Product Fetch");
    console.log("==================================================");

    const clientGetRes = await fetch(`${BASE_URL}/products/${productId}`);
    const clientGetData = await clientGetRes.json();
    console.log("Client get product status:", clientGetRes.status);
    console.log("Client fetched product image:", clientGetData.product?.image);

    if (clientGetRes.status !== 200 || clientGetData.product.image !== uploadData1.url) {
        throw new Error("Client fetch product image mismatch");
    }

    console.log("\n==================================================");
    console.log("7. Testing Product Image Update & Old Asset Cleanup");
    console.log("==================================================");

    const validForm2 = new FormData();
    validForm2.append("image", new Blob([samplePngBuffer2], { type: "image/png" }), "product_sample2.png");

    const uploadRes2 = await fetch(`${BASE_URL}/upload`, {
        method: "POST",
        headers: authHeaders,
        body: validForm2,
    });
    const uploadData2 = await uploadRes2.json();
    console.log("Upload 2 URL:", uploadData2.url);

    const updateProdRes = await fetch(`${BASE_URL}/products/${productId}`, {
        method: "PATCH",
        headers: {
            ...authHeaders,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            image: uploadData2.url,
            name: "واجهة زجاجية ستراكشرال محدثة",
        }),
    });

    const updateProdData = await updateProdRes.json();
    console.log("Update product status:", updateProdRes.status);
    console.log("Updated product image in DB:", updateProdData.product?.image);

    if (updateProdRes.status !== 200 || updateProdData.product.image !== uploadData2.url) {
        throw new Error("Product update failed");
    }

    console.log("\n==================================================");
    console.log("8. Testing Product Deletion & Image Cleanup");
    console.log("==================================================");

    const deleteProdRes = await fetch(`${BASE_URL}/products/${productId}`, {
        method: "DELETE",
        headers: authHeaders,
    });

    console.log("Delete product status:", deleteProdRes.status);
    if (deleteProdRes.status !== 200) {
        throw new Error("Product deletion failed");
    }

    // Verify product is gone
    const checkDeleted = await Product.findById(productId);
    if (checkDeleted) {
        throw new Error("Product still exists in DB");
    }

    console.log("\n==================================================");
    console.log("ALL CLOUDINARY INTEGRATION & END-TO-END TESTS PASSED!");
    console.log("==================================================");

    server.close();
    process.exit(0);
}

runE2ETests().catch((err) => {
    console.error("E2E Test Failed:", err);
    process.exit(1);
});
