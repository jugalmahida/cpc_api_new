const Vertical = require("../models/vertical.model");
const path = require("path");
const fs = require("fs");
const host = process.env.APIHOST 

// Create a new vertical
exports.createVertical = async (req, res) => {
    try {
        const { name, description, code } = req.body;

        let imageUrl = null;
        if (req.file) {
            imageUrl = `${host}/uploads/verticals/${req.file.filename}`;
        }
        
        // Create and save the new vertical
        const newVertical = await Vertical.create({ name, description, code, imageUrl });

        res.status(201).json({
            status: "success",
            message: "Vertical created successfully",
            verticalId: newVertical._id
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
};

// Get a vertical by ID
exports.getVerticalById = async (req, res) => {
    try {
        const { id } = req.params;
        const vertical = await Vertical.findById(id);

        if (!vertical) {
            return res.status(404).json({
                status: "error",
                message: "Vertical not found"
            });
        }

        res.status(200).json({
            status: "success",
            data: vertical
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
};

// Get all verticals
exports.getAllVerticals = async (req, res) => {
    try {
        const verticals = await Vertical.find();
        res.status(200).json({
            status: "success",
            data: verticals
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
};

// Update a vertical by ID
exports.updateVertical = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        if (req.file) {

            updateData.imageUrl = `${host}/uploads/verticals/${req.file.filename}`;

            // Fetch the existing vertical to get the old image URL
            const existingVertical = await Vertical.findById(id);
            if (!existingVertical) {
                return res.status(404).json({ status: "error", message: "Vertical not found" });
            }

            // Delete the old image file if it exists
            if (existingVertical.imageUrl) {
                const oldFilePath = path.join(__dirname, "../uploads/verticals/", path.basename(existingVertical.imageUrl));
                if (fs.existsSync(oldFilePath)) {
                    fs.unlinkSync(oldFilePath);
                }
            }
        }

        const updatedVertical = await Vertical.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedVertical) {
            return res.status(404).json({
                status: "error",
                message: "Vertical not found"
            });
        }

        res.status(200).json({
            status: "success",
            message: "Vertical updated successfully",
            data: updatedVertical
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
};

// Delete a vertical by ID
exports.deleteVertical = async (req, res) => {
    try {
        const { id } = req.params;

        const vertical = await Vertical.findById(id);

        if (!vertical) {
            return res.status(404).json({
                status: "error",
                message: "Vertical not found"
            });
        }

        // Delete profile image if it exists
        if (vertical.imageUrl) {
            const filePath = path.join(__dirname, "../uploads/verticals/", path.basename(vertical.imageUrl));
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        await Vertical.findByIdAndDelete(id);

        res.status(200).json({
            status: "success",
            message: "Vertical deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
};
