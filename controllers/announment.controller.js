const Announcement = require("../models/announcement.model");
const fs = require('fs');
const path = require('path');

// Create a new announcement
exports.createAnnouncement = async (req, res) => {
    try {
        const { title, description } = req.body;

        // Get current date and time from server
        const now = new Date();
        const currentDate = now.toISOString().split("T")[0]; // YYYY-MM-DD format
        const currentTime = now.toLocaleTimeString("en-US", { hour12: false }); // HH:mm:ss format

        let file_attachments = null;
        if (req.file) {
            const BASE_URL = `${req.protocol}://${req.get("host")}/uploads/announcementFile/`;
            file_attachments = BASE_URL + req.file.filename;
        }

        const newAnnouncement = new Announcement({ title, description, date: currentDate, time: currentTime, file_attachments });
        await newAnnouncement.save();

        res.status(201).json({ status: "success", message: "Announcement created successfully", data: newAnnouncement });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};


// Get all announcements
exports.getAllAnnouncements = async (req, res) => {
    try {
        const announcements = await Announcement.find().sort({ createdAt: -1 });
        res.status(200).json({ status: "success", data: announcements });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

// Get a single announcement by ID
exports.getAnnouncementById = async (req, res) => {
    try {
        const { id } = req.params;
        const announcement = await Announcement.findById(id);
        if (!announcement) {
            return res.status(404).json({ status: "error", message: "Announcement not found" });
        }
        res.status(200).json({ status: "success", data: announcement });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

// Get announcements by a specific date
exports.getAnnouncementsByDate = async (req, res) => {
    try {
        const { date } = req.params; // Expecting "YYYY-MM-DD" format
        const announcements = await Announcement.find({ date });

        res.status(200).json({ status: "success", data: announcements });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

// Get announcements by a specific month
exports.getAnnouncementsByMonth = async (req, res) => {
    try {
        const { year, month } = req.params; // Expecting "YYYY" and "MM"
        const regex = new RegExp(`^${year}-${month.padStart(2, "0")}`); // Match YYYY-MM format

        const announcements = await Announcement.find({ date: { $regex: regex } });

        res.status(200).json({ status: "success", data: announcements });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

// Update an announcement
exports.updateAnnouncement = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, date, time } = req.body;

        // Find the existing announcement to get the old file URL
        const announcement = await Announcement.findById(id);
        if (!announcement) {
            return res.status(404).json({ status: "error", message: "Announcement not found" });
        }

        let updateData = { title, description, date, time };

        // If a new file is uploaded, replace the old file and update the database
        if (req.file) {
            // If there is an existing file, delete it
            if (announcement.file_attachments) {
                // Extract the filename from the old file URL
                const oldFileName = announcement.file_attachments.split('/uploads/announcementFile/')[1];
                const oldFilePath = path.join(__dirname, 'uploads', 'announcementFile', oldFileName);

                // Delete the old file from the server
                fs.unlink(oldFilePath, (err) => {
                    if (err) {
                        console.error("Error deleting old file:", err);
                    }
                });
            }

            // Set the new file URL in the update data
            const BASE_URL = `${req.protocol}://${req.get("host")}/uploads/announcementFile/`;
            updateData.file_attachments = BASE_URL + req.file.filename;
        }

        // Update the announcement with new data
        const updatedAnnouncement = await Announcement.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedAnnouncement) {
            return res.status(404).json({ status: "error", message: "Announcement not found" });
        }

        res.status(200).json({ status: "success", message: "Announcement updated successfully", data: updatedAnnouncement });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

// Delete an announcement
exports.deleteAnnouncement = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the announcement to get the file URL before deleting
        const announcement = await Announcement.findById(id);
        if (!announcement) {
            return res.status(404).json({ status: "error", message: "Announcement not found" });
        }

        // If the announcement has a file attachment, delete the associated file
        if (announcement.file_attachments) {
            const filePath = path.join(__dirname,"../uploads/announcementFile",path.basename(announcement.file_attachments));
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }

        // Delete the announcement from the database
        const deletedAnnouncement = await Announcement.findByIdAndDelete(id);
        if (!deletedAnnouncement) {
            return res.status(404).json({ status: "error", message: "Announcement not found" });
        }

        res.status(200).json({ status: "success", message: "Announcement deleted successfully" });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};
