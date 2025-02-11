const Inquiry = require("../models/inquiries.model");

// Create a new inquiry
exports.createInquiry = async (req, res) => {
    try {
        const { name, number, status = "pending", message } = req.body;

        const newInquiry = new Inquiry({ name, number, status, message });
        await newInquiry.save();

        return res.status(201).json({
            status: "success",
            message: "Inquiry created successfully",
            data: newInquiry
        });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

// Get an inquiry by ID
exports.getInquiryById = async (req, res) => {
    try {
        const inquiry = await Inquiry.findById(req.params.id);

        if (!inquiry) {
            return res.status(404).json({ status: "error", message: "Inquiry not found" });
        }

        return res.status(200).json({ status: "success", data: inquiry });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

// Get inquiries by status
exports.getInquiryByStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const inquiries = await Inquiry.find({ status });

        return res.status(200).json({ status: "success", data: inquiries });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

// Get all inquiries
exports.getAllInquiries = async (req, res) => {
    try {
        const inquiries = await Inquiry.find();

        return res.status(200).json({ status: "success", data: inquiries });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

// Update an inquiry by ID
exports.updateInquiry = async (req, res) => {
    try {
        const updatedInquiry = await Inquiry.findByIdAndUpdate(req.params.id, req.body, { new: true });

        if (!updatedInquiry) {
            return res.status(404).json({ status: "error", message: "Inquiry not found" });
        }

        return res.status(200).json({ status: "success", message: "Inquiry updated successfully", data: updatedInquiry });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
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
        res.status(500).json({ status: "error", message: error.message });
    }
};
