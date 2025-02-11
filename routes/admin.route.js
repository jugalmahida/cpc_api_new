const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const authMiddleware = require('../middleware/auth');

// Routes       
// router.post('/register', adminController.registerAdmin);
router.post('/login', adminController.loginAdmin);

// Protected routes (require authentication)
router.get('/profile', authMiddleware, adminController.adminProfile);
 
module.exports = router;