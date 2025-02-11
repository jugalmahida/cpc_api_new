const express = require('express');
const verticalController = require('../controllers/vertical.controller'); // Import the controller
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Create a new vertical
router.post('/create', authMiddleware, verticalController.createVertical);

// Get a vertical by ID
router.get('/getVerticalByID/:id', verticalController.getVerticalById);

// Get all verticals
router.get('/getAll', verticalController.getAllVerticals);

// Update a vertical by ID
router.put('/update/:id', authMiddleware, verticalController.updateVertical);

// Delete a vertical by ID
router.delete('/delete/:id', authMiddleware, verticalController.deleteVertical);

module.exports = router;