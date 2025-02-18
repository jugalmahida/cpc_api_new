const Visit = require("../models/visit.model");

// Middleware to increment total visit count
exports.incrementVisitCount = async (req, res, next) => {
    try {
        const visit = await Visit.findOneAndUpdate({}, { $inc: { total_visits: 1 } }, { new: true, upsert: true });
        res.json({"success":true,"message":"Thank you for visiting"});
        next(); // Continue to the next middleware
    } catch (error) {
        console.error("Error updating visit count:", error);
        next(); // Continue even if tracking fails
    }
};

// Get total visit count
exports.getTotalVisits = async (req, res) => {
    try {
        const visit = await Visit.findOne();
        res.json({ totalVisits: visit ? visit.total_visits : 0 });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};
