import mongoose from "mongoose";

const aboutSchema = new mongoose.Schema(
    {
        badge: {
            type: String,
            default: "جودة هندسية تفوق التوقعات",
        },
        mainTitle: {
            type: String,
            default: "عن شركة الأخوة للألوميتال والزجاج",
        },
        subtitle: {
            type: String,
            default: "خبرة تزيد عن 15 عاماً في تصميم وتنفيذ أجود قطاعات الألوميتال والواجهات الزجاجية المعمارية.",
        },
        description: {
            type: String,
            default: "نحن شركة رائدة متخصصة في تصنيع وتركيب أحدث أنظمة الألوميتال والواجهات الزجاجية الشفافة والمعشقة، ونقدم حلولاً متكاملة للمشاريع السكنية والتجارية مع التركيز على أعلى معايير الجودة والعزل.",
        },
        overlayTitle: {
            type: String,
            default: "نصنع الفخامة من الزجاج",
        },
        overlayText: {
            type: String,
            default: "دمج الرؤية المعمارية العصرية مع متانة الألومنيوم بمنح منزلك أماناً يستمر لأجيال.",
        },
        vision: {
            type: String,
            default: "أن نكون الخيار الأول والشركة الرائدة في تقديم كافة حلول الألوميتال والزجاج في المنطقة.",
        },
        mission: {
            type: String,
            default: "تقديم أفضل المنتجات بأعلى معايير الدقة والأمان والتصميم العصري الذي يلبي كافة تطلعات عملائنا.",
        },
        values: [
            {
                title: { type: String },
                description: { type: String },
                icon: { type: String },
            },
        ],
        whyUs: {
            eyebrow: {
                type: String,
                default: "سر تميزنا واختيار العملاء لنا",
            },
            title: {
                type: String,
                default: "لماذا الأخوة لحلول الألومنيوم؟",
            },
            description: {
                type: String,
                default: "",
            },
            features: [
                {
                    title: { type: String },
                    description: { type: String },
                },
            ],
            image: {
                type: String,
                default: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1000",
            },
        },
        statistics: [
            {
                label: { type: String },
                value: { type: String },
                prefix: { type: String },
                suffix: { type: String },
            },
        ],
        mainImage: {
            type: String,
            default: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200",
        },
    },
    { timestamps: true }
);

const About = mongoose.model("About", aboutSchema);
export default About;
