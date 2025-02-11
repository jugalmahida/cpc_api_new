const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    salary: { type: String, required: true },  // Salary in per month
    location: { type: String, required: true },  // Location of the job (optional)
    qualifications: { type: String, required: true },  // Required qualifications (optional)
    file_attachments: { type: String },  // File attachment URL (optional)
    postedAt: { type: Date, default: Date.now },  // Date the job was posted
});

module.exports = mongoose.model('Job', jobSchema);
