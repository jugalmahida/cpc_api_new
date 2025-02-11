const express = require('express');
const facultyController = require('../controllers/faculty.controller'); // Import the controller
const { handleFileUpload } = require('../utils/fileUpload'); // Import the uploadFile middleware
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Create a new faculty member
router.post('/create', authMiddleware, handleFileUpload("profileImage"), facultyController.createFaculty);

// Get a faculty member by ID
router.get('/getById/:id', facultyController.getFacultyById);

// Get all faculty members
router.get('/getAll', facultyController.getAllFaculty);

// Get faculty members by course ID
router.get('/vertical/:vertical_id', facultyController.getFacultyByVerticalId);

// Update a faculty member by ID
router.put('/update/:id', authMiddleware, handleFileUpload("profileImage"), facultyController.updateFaculty);

// Delete a faculty member by ID
router.delete('/delete/:id', authMiddleware ,facultyController.deleteFaculty);

module.exports = router; 