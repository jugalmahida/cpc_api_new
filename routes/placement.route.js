const express = require('express');
const placementController = require('../controllers/placement.controller'); // Import the controller
const { handleFileUpload } = require('../utils/fileUpload'); // Import the uploadFile middleware
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Create a new placement record
router.post('/create', authMiddleware, handleFileUpload("profileImage"), placementController.createPlacement);

// Get a placement record by ID
router.get('/getById/:id', authMiddleware, placementController.getPlacementById);

// Get all placement records
router.get('/getAll', placementController.getAllPlacements);

// Get placement records by vertical id
router.get('/vertical/:vertical_id', placementController.getPlacementsByVerticalId); // New route

// Update a placement record by ID
router.put('/update/:id', authMiddleware, handleFileUpload("profileImage"), placementController.updatePlacement);

// Delete a placement record by ID
router.delete('/delete/:id', authMiddleware, placementController.deletePlacement);

module.exports = router;