const express = require('express');
const verticalController = require('../controllers/vertical.controller'); // Import the controller
const authMiddleware = require('../middleware/auth');
const { handleFileUpload } = require("../utils/fileUpload");

const router = express.Router();

// Create a new vertical
router.post('/create', handleFileUpload("verticals"), authMiddleware, verticalController.createVertical);

// Get a vertical by ID
router.get('/getVerticalByID/:id', verticalController.getVerticalById);

// Get all verticals
router.get('/getAll', verticalController.getAllVerticals);

// Update a vertical by ID
router.put('/update/:id', handleFileUpload("verticals"), authMiddleware, verticalController.updateVertical);

// Delete a vertical by ID
router.delete('/delete/:id', handleFileUpload("verticals"), authMiddleware, verticalController.deleteVertical);

module.exports = router;