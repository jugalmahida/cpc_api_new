const mongoose = require("mongoose");

const placementSchema = new mongoose.Schema(
    {
        student_name: { type: String, required: true },
        student_image_url: { type: String, default: null },
        company_name: { type: String, required: true },
        package: { type: String, required: true },
        vertical_id: { type: mongoose.Schema.Types.ObjectId, ref: "Vertical", required: true },
        year: { type: Number, required: true }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Placement", placementSchema);