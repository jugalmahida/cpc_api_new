const express = require('express');
const inquiriesController = require('../controllers/inquiries.controller'); // Import the controller
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Create a new inquiry
router.post('/create', inquiriesController.createInquiry);

// Get an inquiry by ID
router.get('/inquiries/:id', authMiddleware, inquiriesController.getInquiryById);

// Get all inquiries
router.get('/getAll', authMiddleware, inquiriesController.getAllInquiries);

// Get inquiries by status
router.get('/getByStatus', authMiddleware, inquiriesController.getInquiryByStatus);

// Update an inquiry by ID
router.put('/update/:id', authMiddleware, inquiriesController.updateInquiry);

// Delete an inquiry by ID
router.delete('/delete/:id', authMiddleware,inquiriesController.deleteInquiry);

module.exports = router;