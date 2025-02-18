const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const authMiddleware = require('../middleware/auth');
const rateLimit = require("express-rate-limit");

// Rate limiter for login
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Max 5 login attempts per 15 minutes
    message: { success: false, error: "Too many login attempts. Try again later." }
});

// Routes       
// router.post('/register', adminController.registerAdmin);
router.post('/login', loginLimiter,adminController.loginAdmin);

// Protected routes (require authentication)
router.get('/profile', authMiddleware, adminController.adminProfile);
 
module.exports = router;