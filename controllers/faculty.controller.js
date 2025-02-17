const Faculty = require("../models/faulty.model");
const fs = require("fs");
const path = require("path");
require('dotenv').config();
const host = process.env.APIHOST 

// Create a new faculty member
exports.createFaculty = async (req, res) => {
    try {
        const { name, position, briefProfile, qualifications, areasOfInterest, achievements, publications, vertical_id } = req.body;
        let profileImageUrl = null;

        // If a file is uploaded, generate the URL
        if (req.file) {
            profileImageUrl = `${host}/uploads/profileImage/${req.file.filename}`;
        }

        const faculty = new Faculty({
            name, position, profileImageUrl, briefProfile, qualifications, areasOfInterest, achievements, publications, vertical_id
        });

        await faculty.save();

        return res.status(201).json({ status: "success", message: "Faculty member created successfully", data: faculty });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

// Get a faculty member by ID
exports.getFacultyById = async (req, res) => {
    try {
        const { id } = req.params;
        const faculty = await Faculty.findById(id);

        if (!faculty) {
            return res.status(404).json({ status: "error", message: "Faculty member not found" });
        }

        return res.status(200).json({ status: "success", data: faculty });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

// Get all faculty members
exports.getAllFaculty = async (req, res) => {
    try {
        const facultyList = await Faculty.find();
        return res.status(200).json({ status: "success", data: facultyList });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

// Get faculty members by vertical ID
exports.getFacultyByVerticalId = async (req, res) => {
    try {
        const { vertical_id } = req.params;
        const faculty = await Faculty.find({ vertical_id });

        return res.status(200).json({ status: "success", data: faculty });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

// Update a faculty member
exports.updateFaculty = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        if (req.file) {
            // Generate new profile image URL
            updates.profileImageUrl = `${host}/uploads/profileImage/${req.file.filename}`;

            // Fetch the existing faculty member to get the old image URL
            const existingFaculty = await Faculty.findById(id);
            if (!existingFaculty) {
                return res.status(404).json({ status: "error", message: "Faculty member not found" });
            }

            // Delete the old image file if it exists
            if (existingFaculty.profileImageUrl) {
                const oldFilePath = path.join(__dirname, "../uploads/profileImage/", path.basename(existingFaculty.profileImageUrl));
                if (fs.existsSync(oldFilePath)) {
                    fs.unlinkSync(oldFilePath);
                }
            }
        }

        const updatedFaculty = await Faculty.findByIdAndUpdate(id, updates, { new: true });

        if (!updatedFaculty) {
            return res.status(404).json({ status: "error", message: "Faculty member not found" });
        }

        return res.status(200).json({ status: "success", message: "Faculty member updated successfully", data: updatedFaculty });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

// Delete a faculty member by ID
exports.deleteFaculty = async (req, res) => {
    try {
        const { id } = req.params;
        const faculty = await Faculty.findById(id);

        if (!faculty) {
            return res.status(404).json({ status: "error", message: "Faculty member not found" });
        }

        // Delete profile image if it exists
        if (faculty.profileImageUrl) {
            const filePath = path.join(__dirname, "../uploads/profileImage/", path.basename(faculty.profileImageUrl));
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        await Faculty.findByIdAndDelete(id);

        return res.status(200).json({ status: "success", message: "Faculty member deleted successfully" });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};