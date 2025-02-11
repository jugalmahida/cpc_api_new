const express = require("express");
const router = express.Router();
const jobController = require("../controllers/job.controller");
const { handleFileUpload } = require("../utils/fileUpload");

// Create a new job post with file upload
router.post('/create', handleFileUpload('announcementFile'), jobController.createJob);

// Get all job posts
router.get('/getAll', jobController.getAllJobs);

// Get a single job post by ID
router.get('/getByID/:id', jobController.getJobById);

// Update a job post with file upload (replace old file)
router.put('/update/:id', handleFileUpload('announcementFile'), jobController.updateJob);

// Delete a job post with file deletion
router.delete('/delete/:id', jobController.deleteJob);

module.exports = router;
