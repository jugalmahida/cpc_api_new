const fs = require("fs");
const path = require("path");
const Placement = require("../models/placement.model");
require('dotenv').config();
const host = process.env.APIHOST 

// Create a new placement record
exports.createPlacement = async (req, res) => {
    try {
        const { student_name, company_name, package, vertical_id, year } = req.body;
        let student_image_url = null;

        const BASE_URL = `${host}/uploads/profileImage/`;

        if (req.file) {
            const timestamp = Date.now();
            const randomNum = Math.floor(Math.random() * 1000000000);
            const newFileName = `student-${timestamp}-${randomNum}.jpg`;
            const newFileDirectory = path.join(__dirname, "../uploads/profileImage/");
            student_image_url = path.join(newFileDirectory, newFileName);

            if (!fs.existsSync(newFileDirectory)) {
                fs.mkdirSync(newFileDirectory, { recursive: true });
            }

            fs.renameSync(req.file.path, student_image_url);
            student_image_url = BASE_URL + newFileName;
        }

        const placement = new Placement({ student_name, student_image_url, company_name, package, vertical_id, year });
        await placement.save();

        return res.status(201).json({ status: "success", message: "Placement record created successfully", data: placement });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

// Update placement record
exports.updatePlacement = async (req, res) => {
    try {
        const { id } = req.params;
        const { student_name, company_name, package, course_id, year } = req.body;
        let newStudentImageUrl = null;

        const BASE_URL = `${host}/uploads/profileImage/`;

        if (req.file) {
            const timestamp = Date.now();
            const randomNum = Math.floor(Math.random() * 1000000000);
            const newFileName = `student-${timestamp}-${randomNum}.jpg`;
            const newFileDirectory = path.join(__dirname, "../uploads/profileImage/");
            newStudentImageUrl = path.join(newFileDirectory, newFileName);

            if (!fs.existsSync(newFileDirectory)) {
                fs.mkdirSync(newFileDirectory, { recursive: true });
            }

            fs.renameSync(req.file.path, newStudentImageUrl);
            newStudentImageUrl = BASE_URL + newFileName;
        }

        const placement = await Placement.findById(id);
        if (!placement) {
            return res.status(404).json({ status: "error", message: "Placement record not found" });
        }

        if (newStudentImageUrl && placement.student_image_url) {
            const oldFilePath = path.join(__dirname, "../uploads/profileImage/", path.basename(placement.student_image_url));
            if (fs.existsSync(oldFilePath)) fs.unlinkSync(oldFilePath);
        }

        placement.student_name = student_name || placement.student_name;
        placement.company_name = company_name || placement.company_name;
        placement.package = package || placement.package;
        placement.course_id = course_id || placement.course_id;
        placement.year = year || placement.year;
        placement.student_image_url = newStudentImageUrl || placement.student_image_url;

        await placement.save();
        return res.status(200).json({ status: "success", message: "Placement record updated successfully", data: placement });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

// Delete placement record
exports.deletePlacement = async (req, res) => {
    try {
        const { id } = req.params;
        const placement = await Placement.findById(id);
        if (!placement) {
            return res.status(404).json({ status: "error", message: "Placement record not found" });
        }

        if (placement.student_image_url) {
            const filePath = path.join(__dirname, "../uploads/profileImage/", path.basename(placement.student_image_url));
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }

        await Placement.findByIdAndDelete(id);
        return res.status(200).json({ status: "success", message: "Placement record deleted successfully" });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

// Get placement record by ID
exports.getPlacementById = async (req, res) => {
    try {
        const { id } = req.params;
        const placement = await Placement.findById(id);
        if (!placement) {
            return res.status(404).json({ status: "error", message: "Placement record not found" });
        }
        return res.status(200).json({ status: "success", data: placement });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

// Get all placement records
exports.getAllPlacements = async (req, res) => {
    try {
        const placements = await Placement.find();
        return res.status(200).json({ status: "success", data: placements });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

// Get placements by course ID
exports.getPlacementsByVerticalId = async (req, res) => {
    try {
        const { id } = req.params;
        const placements = await Placement.find({ vertical_id: id });
        return res.status(200).json({ status: "success", data: placements });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};
