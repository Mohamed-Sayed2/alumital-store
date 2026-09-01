import bcrypt from "bcryptjs";
import Admin from "../models/admin.model.js";

const seedAdmin = async () => {
    try {
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (!adminEmail || !adminPassword) {
            console.log("Admin seeding skipped: ADMIN_EMAIL or ADMIN_PASSWORD not configured in .env");
            return;
        }

        const existingAdmin = await Admin.findOne({ email: adminEmail.toLowerCase().trim() });
        if (existingAdmin) {
            console.log("Admin user already exists.");
            return;
        }

        const count = await Admin.countDocuments();
        if (count > 0) {
            console.log("Admin users already exist in database.");
            return;
        }

        const hashedPassword = await bcrypt.hash(adminPassword, 10);
        await Admin.create({
            email: adminEmail.toLowerCase().trim(),
            password: hashedPassword,
        });

        console.log(`Admin user successfully seeded: ${adminEmail}`);
    } catch (error) {
        console.error("Error during admin seeding:", error.message);
    }
};

export default seedAdmin;
