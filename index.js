const pool = require('./config/db');
const express = require('express');
const app = express();
const path = require("path");
require('dotenv').config();
const cors = require("cors");

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

const port = process.env.PORT;
const version = process.env.VERSION;
const hostname = process.env.HOSTNAME;

const { incrementVisitCount } = require("./controllers/visit.controller");

// Increment the counter
app.get("/", incrementVisitCount, (req, res) => {
    res.status(200).json({ "success": "true", "message": "welcome the api of cpc",  });
});

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



app.listen(port, () => {
    console.log(`Server running at ${hostname}:${port}/api/${version}`);
});