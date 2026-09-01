import mongoose from "mongoose";

const validateObjectId = (paramName = "id") => (req, res, next) => {
    const id = req.params[paramName];
    if (id && !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            message: `Invalid ${paramName} format`,
        });
    }
    next();
};

export default validateObjectId;
