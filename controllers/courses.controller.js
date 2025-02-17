const fs = require("fs");
const path = require("path");
const Course = require("../models/courses.model");
require('dotenv').config();
const host = process.env.APIHOST 
// Create a new course
exports.createCourse = async (req, res) => {
    try {
        const { name, description, totalSeats, duration, course_type, vertical_id } = req.body;
        const filePath = req.file ? req.file.path : null;

        // Generate a public URL
        const publicFileUrl = req.file ? `${host}/uploads/pdfs/${req.file.filename}` : null;

        // Create a new course
        const newCourse = await Course.create({
            name,
            description,
            totalSeats,
            duration,
            course_type,
            vertical_id,
            pdflink: publicFileUrl
        });

        res.status(201).json({
            status: "success",
            message: "Course created successfully",
            courseId: newCourse._id,
            fileUrl: publicFileUrl
        });

    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
};

// Get a course by ID
exports.getCourseById = async (req, res) => {
    try {
        const { id } = req.params;
        const course = await Course.findById(id);

        if (!course) {
            return res.status(404).json({
                status: "error",
                message: "Course not found"
            });
        }

        res.status(200).json({
            status: "success",
            data: course
        });

    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
};

// Get all courses
exports.getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find();
        res.status(200).json({
            status: "success",
            data: courses
        });

    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
};

// Get courses by vertical ID
exports.getCoursesByVerticalId = async (req, res) => {
    try {
        const { vertical_id } = req.params;
        const courses = await Course.find({ vertical_id });

        res.status(200).json({
            status: "success",
            data: courses
        });

    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
};

// Update a course by ID
exports.updateCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, totalSeats, duration, course_type, vertical_id } = req.body;

        let newFilePath = null;
        const BASE_URL = `${host}/uploads/pdfs/`;

        if (req.file) {
            const newFileName = `pdf-${Date.now()}-${Math.floor(Math.random() * 1000000000)}.pdf`;
            const newFileDirectory = path.join(__dirname, "../uploads/pdfs/");
            newFilePath = path.join(newFileDirectory, newFileName);

            if (!fs.existsSync(newFileDirectory)) {
                fs.mkdirSync(newFileDirectory, { recursive: true });
            }

            fs.renameSync(req.file.path, newFilePath);
            newFilePath = BASE_URL + newFileName;
        }

        const course = await Course.findById(id);
        if (!course) {
            return res.status(404).json({
                status: "error",
                message: "Course not found"
            });
        }

        // Delete old file if a new file is uploaded
        if (newFilePath && course.pdflink) {
            const oldFilePath = path.join(__dirname, "../uploads/pdfs/", path.basename(course.pdflink));
            if (fs.existsSync(oldFilePath)) {
                fs.unlinkSync(oldFilePath);
            }
        }

        course.name = name || course.name;
        course.description = description || course.description;
        course.totalSeats = totalSeats || course.totalSeats;
        course.duration = duration || course.duration;
        course.course_type = course_type || course.course_type;
        course.vertical_id = vertical_id || course.vertical_id;
        if (newFilePath) course.pdflink = newFilePath;

        await course.save();

        res.status(200).json({
            status: "success",
            message: "Course updated successfully",
            data: course
        });

    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
};

// Delete a course by ID
exports.deleteCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const course = await Course.findById(id);

        if (!course) {
            return res.status(404).json({
                status: "error",
                message: "Course not found"
            });
        }

        // Delete associated PDF file if exists
        if (course.pdflink) {
            const filePath = path.join(__dirname, "../uploads/pdfs/", path.basename(course.pdflink));
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        await Course.findByIdAndDelete(id);

        res.status(200).json({
            status: "success",
            message: "Course and associated file deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
};
