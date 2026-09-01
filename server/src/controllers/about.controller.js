import About from "../models/about.model.js";

const defaultValues = [
    { title: "الجودة العالية", description: "نستخدم أفضل القطاعات والإكسسوارات المعتمدة.", icon: "ShieldCheck" },
    { title: "الالتزام بالمواعيد", description: "تسليم ريادي في المواعيد المحددة بدون تأخير.", icon: "Clock" },
    { title: "الدقة والتنفيذ", description: "فنيون ومهندسون متناغمون على أعلى مستوى.", icon: "Award" },
];

const defaultStats = [
    { label: "عاماً من الخبرة", value: "15", suffix: "+" },
    { label: "مشروع مكتمل", value: "500", suffix: "+" },
    { label: "عميل سعيد", value: "1200", suffix: "+" },
];

export const getAbout = async (req, res) => {
    try {
        let about = await About.findOne();
        if (!about) {
            about = await About.create({
                values: defaultValues,
                statistics: defaultStats,
            });
        }
        return res.status(200).json({
            message: "About page data fetched successfully",
            about,
        });
    } catch (error) {
        console.error("Error fetching about page data:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const updateAbout = async (req, res) => {
    try {
        const updateData = req.body;
        let about = await About.findOne();

        if (!about) {
            about = await About.create(updateData);
        } else {
            about = await About.findByIdAndUpdate(
                about._id,
                { $set: updateData },
                { new: true, runValidators: true }
            );
        }

        return res.status(200).json({
            message: "About page data updated successfully",
            about,
        });
    } catch (error) {
        console.error("Error updating about page data:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
