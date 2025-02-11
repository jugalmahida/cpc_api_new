const fs = require('fs');
const path = require('path');
const Job = require('../models/job.model');

// Create a new job post with a file attachment
exports.createJob = async (req, res) => {
    try {
        const { title, description, salary, location, qualifications } = req.body;

        // Handle file attachment if it exists
        let file_attachments = '';
        if (req.file) {
            const BASE_URL = `${req.protocol}://${req.get("host")}/uploads/announcementFile/`;
            file_attachments = BASE_URL + req.file.filename;
        }

        const newJob = new Job({
            title,
            description,
            salary,
            location,
            qualifications,
            file_attachments
        });

        const savedJob = await newJob.save();
        res.status(201).json({ status: 'success', message: 'Job created successfully', data: savedJob });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// Get all job posts
exports.getAllJobs = async (req, res) => {
    try {
        const jobs = await Job.find();
        res.status(200).json({ status: 'success', data: jobs });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// Get a single job by ID
exports.getJobById = async (req, res) => {
    try {
        const { id } = req.params;
        const job = await Job.findById(id);
        if (!job) {
            return res.status(404).json({ status: 'error', message: 'Job not found' });
        }
        res.status(200).json({ status: 'success', data: job });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// Update a job post with file handling (replace old file if new one is uploaded)
exports.updateJob = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, salary, location, qualifications } = req.body;

        // Find the existing job to get the old file URL
        const job = await Job.findById(id);
        if (!job) {
            return res.status(404).json({ status: "error", message: "Job not found" });
        }

        // Initialize updateData with only provided fields
        let updateData = { title, description, salary, location, qualifications };

        // If a new file is uploaded, replace the old file and update the database
        if (req.file) {
            // If there is an existing file, delete it
            if (job.file_attachments) {
                // Extract the filename from the old file URL
                const oldFileName = job.file_attachments.split('/uploads/announcementFile/')[1];
                const oldFilePath = path.join(__dirname, '../uploads/announcementFile', oldFileName);

                // Delete the old file from the server
                fs.unlink(oldFilePath, (err) => {
                    if (err) {
                        console.error("Error deleting old file:", err);
                    }
                });
            }

            // Set the new file URL in the update data
            const BASE_URL = `${req.protocol}://${req.get("host")}/uploads/announcementFile/`;
            updateData.file_attachments = BASE_URL + req.file.filename;
        }

        // Update job with only provided fields
        const updatedJob = await Job.findByIdAndUpdate(id, updateData, { new: true });

        res.status(200).json({ status: "success", message: "Job updated successfully", data: updatedJob });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};


// Delete a job post with file deletion
exports.deleteJob = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the job to get the file URL before deleting
        const job = await Job.findById(id);
        if (!job) {
            return res.status(404).json({ status: 'error', message: 'Job not found' });
        }

        // If the announcement has a file attachment, delete the associated file
        if (job.file_attachments) {
            const filePath = path.join(__dirname, "../uploads/announcementFile", path.basename(job.file_attachments));
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }

        // Delete the job post from the database
        const deletedJob = await Job.findByIdAndDelete(id);
        if (!deletedJob) {
            return res.status(404).json({ status: 'error', message: 'Job not found' });
        }

        res.status(200).json({ status: 'success', message: 'Job deleted successfully' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};
