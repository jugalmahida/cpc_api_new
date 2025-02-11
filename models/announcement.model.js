const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    file_attachments: { type: String, default: null } // URL of the uploaded file
}, { timestamps: true });

module.exports = mongoose.model("Announcement", announcementSchema);
