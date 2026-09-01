import Settings from "../models/settings.model.js";

export const getSettings = async (req, res) => {
    try {
        let settings = await Settings.findOne();
        if (!settings) {
            settings = await Settings.create({});
        }
        return res.status(200).json({
            message: "Settings fetched successfully",
            settings,
        });
    } catch (error) {
        console.error("Error fetching settings:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const updateSettings = async (req, res) => {
    try {
        const updateData = req.body;
        let settings = await Settings.findOne();

        if (!settings) {
            settings = await Settings.create(updateData);
        } else {
            settings = await Settings.findByIdAndUpdate(
                settings._id,
                { $set: updateData },
                { new: true, runValidators: true }
            );
        }

        return res.status(200).json({
            message: "Settings updated successfully",
            settings,
        });
    } catch (error) {
        console.error("Error updating settings:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
