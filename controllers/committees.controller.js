// routes/committees.js
const Committees = require('../models/committees.model');
const Faculty = require("../models/faulty.model");

exports.getAll = async (req, res) => {
    try {
        const committees = await Committees.find({}, { _id: 1, name: 1 });

        const facultyPromises = committees.map(async (committee) => {
            return await Faculty.find({ committees_id: committee._id }, { _id: 1, name: 1, position: 1,profileImageUrl:1 });
        });

        const faculty = await Promise.all(facultyPromises);

        const data = committees.map((committee, index) => ({
            _id: committee._id,             // Directly include _id
            name: committee.name,           // Directly include name
            faculties: faculty[index] || []
        }));

        res.status(200).json({ status: "success", data: data }); // Use 'data' variable

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

// GET a single committee by ID
exports.getById = async (req, res) => {
    const { id } = req.params;

    try {
        const committee = await Committees.findById(id, { _id: 1, name: 1 });

        if (!committee) {
            return res.status(404).json({ status: "error", message: 'Committee not found' });
        }

        const faculty = await Faculty.find({ committees_id: id }, { _id: 1, name: 1, position: 1 }); // No need for map or Promise.all

        const data = {  // Create the object directly
            _id: committee._id,
            name: committee.name,
            faculties: faculty || []
        };

        res.status(200).json({ status: "success", data: data });

    } catch (err) {
        console.error(err);
        if (err.kind === 'ObjectId') { // Check for invalid ObjectId
            return res.status(404).json({ status: "error", message: 'Committee not found' });
        }
        res.status(500).json({ status: "error",message: 'Server Error' });
    }
};


// POST a new committee
exports.create = async (req, res) => {
    try {
        const { name } = req.body;  // Assuming 'name' is the required field

        const newCommittee = new Committees({
            name,
        });

        const committee = await newCommittee.save();
        res.status(201).json(committee); // 201 Created status code
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: "error",message: 'Server Error' });
    }
};

// PUT (update) a committee
exports.update = async (req, res) => {
    try {
        const { name } = req.body;

        const committee = await Committees.findByIdAndUpdate(
            req.params.id,
            { name }, // Update fields as needed
            { new: true, runValidators: true } // Return updated doc, validate updates
        );

        if (!committee) {
            return res.status(404).json({ status: "error",  message: 'Committee not found' });
        }

        res.status(200).json({ status: "success", messgae: "Committee Update successfully", data: committee });
    } catch (err) {
        console.error(err);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ status: "error", message: 'Committee not found' });
        }
        res.status(500).json({ status: "error", message: 'Server Error' });
    }
};

exports.removeFaculty = async (req, res) => {
    const { facultyId } = req.params;

    try {
        // 1. Find the faculty member and update committees_id to null
        const updatedFaculty = await Faculty.findByIdAndUpdate(
            facultyId,
            { $set: { committees_id: null } },
            { new: true } // Return the updated faculty document
        );

        if (!updatedFaculty) {
            return res.status(404).json({ message: 'Faculty member not found' });
        }

        res.status(200).json({
            status: "success",
            message: "Faculty member removed from committee",
            data: updatedFaculty // Include the updated faculty data in the response
        });

    } catch (err) {
        console.error(err);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Faculty or Committee not found' }); // More specific message
        }
        res.status(500).json({ message: 'Server Error' });
    }
};

// DELETE a committee
exports.delete = async (req, res) => {
    const { id } = req.params;

    try {
        const committee = await Committees.findByIdAndDelete(id);

        if (!committee) {
            return res.status(404).json({ status: "error", message: 'Committee not found' });
        }

        // Update associated faculty members
        await Faculty.updateMany(
            { committees_id: id }, // Find faculty with the committee's ID
            { $set: { committees_id: null } } // Set committees_id to null
        );

        res.status(200).json({ status: "success", message: "Committee deleted successfully" });
    } catch (err) {
        console.error(err);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ status: "error", message: 'Committee not found' });
        }
        res.status(500).json({ status: "error", message: 'Server Error' });
    }
};