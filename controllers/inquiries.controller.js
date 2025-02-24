const Inquiry = require("../models/inquiries.model");
const { body, validationResult } = require("express-validator");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");

// Rate limiting middleware
const createInquiryLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // Limit each IP to 20 requests per windowMs
    message: "Too many inquiries created from this IP, please try again after 15 minutes",
});

// Create a new inquiry with validation
exports.createInquiry = [
    createInquiryLimiter,
    helmet(),
    body("name").trim().isLength({ min: 1 }).escape(),
    body("number").trim().isMobilePhone("any").escape(),
    body("message").trim().escape(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { name, number, status = "pending", message } = req.body;

            const newInquiry = new Inquiry({ name, number, status, message });
            await newInquiry.save();

            return res.status(201).json({
                status: "success",
                message: "Inquiry created successfully",
                data: newInquiry,
            });
        } catch (error) {
            console.error("Error creating inquiry:", error); // Log the error
            res.status(500).json({ status: "error", message: "Internal server error" });
        }
    },
];

// Get an inquiry by ID
exports.getInquiryById = async (req, res) => {
    try {
        const inquiry = await Inquiry.findById(req.params.id);

        if (!inquiry) {
            return res.status(404).json({ status: "error", message: "Inquiry not found" });
        }

        return res.status(200).json({ status: "success", data: inquiry });
    } catch (error) {
        console.error("Error getting inquiry by ID:", error);
        res.status(500).json({ status: "error", message: "Internal server error" });
    }
};

// Get inquiries by status
exports.getInquiryByStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const inquiries = await Inquiry.find({ status });

        return res.status(200).json({ status: "success", data: inquiries });
    } catch (error) {
        console.error("Error getting inquiries by status:", error);
        res.status(500).json({ status: "error", message: "Internal server error" });
    }
};

// Get all inquiries
exports.getAllInquiries = async (req, res) => {
    try {
        const inquiries = await Inquiry.find();

        return res.status(200).json({ status: "success", data: inquiries });
    } catch (error) {
        console.error("Error getting all inquiries:", error);
        res.status(500).json({ status: "error", message: "Internal server error" });
    }
};

// Update an inquiry by ID
exports.updateInquiry = async (req, res) => {
    try {
        const updatedInquiry = await Inquiry.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!updatedInquiry) {
            return res.status(404).json({ status: "error", message: "Inquiry not found" });
        }

        return res.status(200).json({
            status: "success",
            message: "Inquiry updated successfully",
            data: updatedInquiry,
        });
    } catch (error) {
        console.error("Error updating inquiry:", error);
        res.status(500).json({ status: "error", message: "Internal server error" });
    }
};

// Delete an inquiry by ID
exports.deleteInquiry = async (req, res) => {
    try {
        const deletedInquiry = await Inquiry.findByIdAndDelete(req.params.id);

        if (!deletedInquiry) {
            return res.status(404).json({ status: "error", message: "Inquiry not found" });
        }

        return res.status(200).json({ status: "success", message: "Inquiry deleted successfully" });
    } catch (error) {
        console.error("Error deleting inquiry:", error);
        res.status(500).json({ status: "error", message: "Internal server error" });
    }
};