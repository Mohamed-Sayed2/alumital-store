import dotenv from "dotenv";
dotenv.config();

import app from "../src/app.js";
import connectDB from "../src/config/db.js";
import seedAdmin from "../src/utils/seedAdmin.js";

let isConnected = false;

const init = async () => {
    if (!isConnected) {
        await connectDB();
        await seedAdmin();
        isConnected = true;
    }
};

export default async function handler(req, res) {
    await init();
    return app(req, res);
}
