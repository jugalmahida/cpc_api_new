const path = require("path");
const fs = require("fs");
const Media = require("../models/media.model");

require('dotenv').config();
const host = process.env.APIHOST 

// Upload media images
exports.uploadMedia = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                status: "error",
                message: "No image uploaded",
            });
        }

        const savedImages = [];

        for (const file of req.files) {
            const imageUrl = `${host}/uploads/media/${file.filename}`;

            const newImage = new Media({ imageUrl });
            const savedImage = await newImage.save();
            savedImages.push(savedImage);
        }

        return res.status(201).json({
            status: "success",
            message: "Media images uploaded successfully",
            data: savedImages,
        });

    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

// Get all media
exports.getAllMedia = async (req, res) => {
    try {
        const media = await Media.find().sort({ createdAt: -1 });
        res.status(200).json(media);
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

// Get a single media file by ID
exports.getMediaById = async (req, res) => {
    try {
        const media = await Media.findById(req.params.id);
        if (!media) {
            return res.status(404).json({ message: "Media not found" });
        }
        res.status(200).json(media);
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

// Delete media
exports.deleteMedia = async (req, res) => {
    try {
        const media = await Media.findById(req.params.id);
        if (!media) {
            return res.status(404).json({ message: "Media not found" });
        }

        // Get the filename from imageUrl
        const fileName = path.basename(media.imageUrl);
        const filePath = path.join(__dirname, "../uploads/media/", fileName);

        // Delete the image file if it exists
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        // Delete media from the database
        await Media.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: "Media deleted successfully" });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};
