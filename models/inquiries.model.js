const mongoose = require("mongoose");

const inquirySchema = new mongoose.Schema({
    name: { type: String, required: true },
    number: { type: String, required: true },
    status: { type: String, enum: ["pending", "resolved"], default: "pending" },
    message: { type: String, required: true },
}, { timestamps: true });

const Inquiry = mongoose.model("Inquiry", inquirySchema);

module.exports = Inquiry;