const express = require('express');
const committeeController = require('../controllers/committees.controller'); // Import the controller
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// Create
router.post('/create', authMiddleware, committeeController.create);

// Update
router.put('/update/:id', authMiddleware, committeeController.update);

// Get by id
router.get('/getById/:id', committeeController.getById);

// Get all
router.get('/getAll', committeeController.getAll);

// Delete
router.delete('/delete/:id', authMiddleware, committeeController.delete);

module.exports = router;
