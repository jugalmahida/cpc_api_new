const express = require('express');
const coursesController = require('../controllers/courses.controller'); // Import the controller
const { handleFileUpload } = require('../utils/fileUpload'); // Import the uploadFile middleware
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Create a new course (with PDF upload) 
router.post('/create', authMiddleware, handleFileUpload("pdf"), coursesController.createCourse);

// Update a course by ID (with optional PDF upload)
router.put('/update/:id', authMiddleware, handleFileUpload("pdf"), coursesController.updateCourse);

// Get a course by ID
router.get('/getById/:id', coursesController.getCourseById);

// Get all courses
router.get('/getAll', coursesController.getAllCourses);

// Get courses by vertical ID
router.get('/vertical/:vertical_id', coursesController.getCoursesByVerticalId);

// Delete a course by ID
router.delete('/delete/:id', authMiddleware, coursesController.deleteCourse);

module.exports = router;