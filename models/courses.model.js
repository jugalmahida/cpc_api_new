const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    totalSeats: { type: Number, required: true },
    duration: { type: String, required: true },
    course_type: { type: String, required: true },
    vertical_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Vertical" },
    pdflink: { type: String }
}, { timestamps: true });

module.exports = mongoose.model("Course", CourseSchema);
