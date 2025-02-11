const Vertical = require("../models/vertical.model");

// Create a new vertical
exports.createVertical = async (req, res) => {
    try {
        const { name, description, code } = req.body;

        // Create and save the new vertical
        const newVertical = await Vertical.create({ name, description, code });

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
        const deletedVertical = await Vertical.findByIdAndDelete(id);

        if (!deletedVertical) {
            return res.status(404).json({
                status: "error",
                message: "Vertical not found"
            });
        }

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
