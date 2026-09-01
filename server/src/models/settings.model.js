import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
    {
        companyName: {
            type: String,
            default: "الأخوة",
        },
        subtitle: {
            type: String,
            default: "ALUMITAE & GLASS SOLUTIONS",
        },
        phone: {
            type: String,
            default: "+20 100 000 0000",
        },
        whatsapp: {
            type: String,
            default: "+20 100 000 0000",
        },
        email: {
            type: String,
            default: "info@alalikhwa.com",
        },
        address: {
            type: String,
            default: "القاهرة، مصر",
        },
        description: {
            type: String,
            default: "حلول ألوميتال حديثة للمنازل والفلل والشركات، بأفضل القطاعات المحلية والعالمية وتنفيذ احترافي.",
        },
        copyright: {
            type: String,
            default: "الأخوة للألوميتال والزجاج. جميع الحقوق محفوظة.",
        },
        workingHours: {
            days: {
                type: String,
                default: "السبت - الخميس",
            },
            open: {
                type: String,
                default: "9:00 ص",
            },
            close: {
                type: String,
                default: "9:00 م",
            },
            closedDays: {
                type: String,
                default: "الجمعة: عطلة أسبوعية",
            },
        },
        socialLinks: {
            facebook: {
                type: String,
                default: "https://facebook.com",
            },
            instagram: {
                type: String,
                default: "https://instagram.com",
            },
        },
    },
    { timestamps: true }
);

const Settings = mongoose.model("Settings", settingsSchema);
export default Settings;
