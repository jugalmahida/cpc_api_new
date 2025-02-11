// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    // Get the token from the request header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({
            status: "error",
            message: "Access denied. No token provided."
        });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach the decoded admin data to the request object
        req.admin = decoded;

        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
        res.status(400).json({
            status: "error",
            message: "Invalid token."
        });
    }
};

module.exports = authMiddleware;