const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Admin = require('../models/admin.model');

// Create a new admin (Register)
exports.registerAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({
                status: "error",
                message: "Admin with this email already exists"
            });
        }

        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create a new admin
        const newAdmin = await Admin.create({ email, password: hashedPassword });

        res.status(201).json({
            status: "success",
            message: "Admin created successfully",
            adminId: newAdmin._id
        });

    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
};

// Login admin
exports.loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find admin by email
        const admin = await Admin.findOne({ email });

        // Check if admin exists
        if (!admin) {
            return res.status(401).json({
                status: "error",
                message: "Invalid email or password"
            });
        }

        // Compare passwords
        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                status: "error",
                message: "Invalid email or password"
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: admin._id, email: admin.email },
            process.env.JWT_SECRET,
            { expiresIn: '3h' }
        );

        res.status(200).json({
            status: "success",
            message: "Login successful",
            token: token,
            adminId: admin._id
        });

    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
};

// Profile
exports.adminProfile = async (req, res) => {
    res.status(200).json({
        status: "success",
        message: "Access granted",
        admin: req.admin // Admin data from the token
    });
};
