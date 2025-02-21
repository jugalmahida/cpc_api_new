const pool = require('./config/db');
const express = require('express');
const app = express();
const path = require("path");
require('dotenv').config();
const cors = require("cors");
const rateLimit = require("express-rate-limit"); // Import rate limiter

const allowedDomains = process.env.ALLOWED_DOMAINS.split(",");

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedDomains.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("CORS policy: This domain is not allowed"));
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Apply rate limiting to all API routes
const apiLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 100, // Max 100 requests per IP per minute
    message: { success: false, error: "Too many requests, please try again later." },
    headers: true, // Send rate limit info in headers
});

// Apply rate limiting to all API endpoints
app.use("/api/", apiLimiter);

const port = process.env.PORT;
const version = process.env.VERSION;
const hostname = process.env.HOSTNAME;

// Define the all routes
const authRoutes = require('./routes/admin.route');
const verticalRoutes = require("./routes/vertical.route")
const inquiriesRoutes = require("./routes/inquiries.route")
const coursesRoutes = require("./routes/courses.route")
const facultyRoutes = require("./routes/faculty.route")
const placementRoutes = require("./routes/placement.route")
const eventRoutes = require("./routes/event.route")
const announcementRoutes = require("./routes/announment.route");
const jobRoutes = require("./routes/job.route");
const visitRoutes = require("./routes/visit.route");
const mediaRoutes = require("./routes/media.route");
const committeesRoutes = require("./routes/committees.route");



// Use string interpolation for version
app.use(`/api/${version}/visits`, visitRoutes);
app.use(`/api/${version}/auth`, authRoutes);
app.use(`/api/${version}/vertical`, verticalRoutes);
app.use(`/api/${version}/inquiry`, inquiriesRoutes);
app.use(`/api/${version}/course`, coursesRoutes);
app.use(`/api/${version}/faculty`, facultyRoutes);
app.use(`/api/${version}/placement`, placementRoutes);
app.use(`/api/${version}/event`, eventRoutes);
app.use(`/api/${version}/announcement`, announcementRoutes);
app.use(`/api/${version}/jobs`, jobRoutes);
app.use(`/api/${version}/media`, mediaRoutes);
app.use(`/api/${version}/committees`, committeesRoutes);




app.listen(port, () => {
    console.log(`Server running at ${hostname}:${port}/api/${version}`);
});