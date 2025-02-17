const fs = require("fs");
const path = require("path");
const Event = require("../models/event.model");
const EventImage = require("../models/eventImages.model");

require('dotenv').config();
const host = process.env.APIHOST 
// Create a new event
exports.createEvent = async (req, res) => {
    try {
        const { name } = req.body;
        const newEvent = new Event({ name });
        const savedEvent = await newEvent.save();

        return res.status(201).json({
            status: "success",
            message: "Event created successfully",
            data: savedEvent,
        });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

// Get by eventID 
exports.getEventById = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the event and populate images
        const event = await Event.findById(id, { __v: 0, createdAt: 0, updatedAt: 0, event: 0,date:0 })
            .populate({
                path: "images",
                select: "-__v -createdAt -updatedAt -event",
            });

        if (!event) {
            return res.status(404).json({ status: "error", message: "Event not found" });
        }

        // Group images by year and month
        const groupedImages = event.images.reduce((acc, image) => {
            const yearMonthKey = image.date.toISOString().slice(0, 7); // Extract "YYYY-MM"
            if (!acc[yearMonthKey]) {
                acc[yearMonthKey] = [];
            }
            acc[yearMonthKey].push(image);
            return acc;
        }, {});

        return res.status(200).json({
            status: "success",
            data: {
                _id: event._id,
                name: event.name,
                images: groupedImages
            }
        });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

// Get all events with images
exports.getAllEvents = async (req, res) => {
    try {
        const events = await Event.find({}, { __v: 0, createdAt: 0, updatedAt: 0 }).populate("images");
        return res.status(200).json({ status: "success", data: events });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

// Get event by month
exports.getEventByMonth = async (req, res) => {
    try {
        const { month, eventid } = req.params; // Example: 2025-05

        const [year, monthNumber] = month.split("-").map(Number);

        if (!year || !monthNumber || monthNumber < 1 || monthNumber > 12) {
            return res.status(400).json({ status: "error", message: "Invalid month format. Use YYYY-MM." });
        }

        const startDate = new Date(year, monthNumber - 1, 1); // First day of the month
        const endDate = new Date(year, monthNumber, 0, 23, 59, 59); // Last day of the month

        const events = await EventImage.find({
            date: { $gte: startDate, $lte: endDate }
        }).populate("imageUrl");

        // Group directly by month without event type grouping
        const groupedByMonth = events.reduce((acc, event) => {
            const eventMonth = event.date.toISOString().slice(0, 7); // Gets YYYY-MM format
            if (!acc[eventMonth]) {
                acc[eventMonth] = [];
            }
            acc[eventMonth].push(event);
            return acc;
        }, {});

        return res.status(200).json({
            status: "success",
            data: groupedByMonth
        });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};
// Update an event by ID
exports.updateEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, date } = req.body;

        const updatedEvent = await Event.findByIdAndUpdate(id, { name, date }, { new: true });

        if (!updatedEvent) {
            return res.status(404).json({ status: "error", message: "Event not found" });
        }

        return res.status(200).json({ status: "success", message: "Event updated successfully", data: updatedEvent });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

// Delete an event and associated images
exports.deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const event = await Event.findById(id).populate("images");

        if (!event) {
            return res.status(404).json({ status: "error", message: "Event not found" });
        }

        // Delete images from file storage
        event.images.forEach(async (image) => {
            const filePath = path.join(__dirname, "../uploads/events", path.basename(image.imageUrl));
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

            await EventImage.findByIdAndDelete(image._id);
        });

        // Delete event from DB
        await Event.findByIdAndDelete(id);

        return res.status(200).json({ status: "success", message: "Event and images deleted successfully" });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

// Add an event image
exports.addEventImage = async (req, res) => {
    try {
        const { event_id } = req.params;
        const { date } = req.body;

        // Check if any files were uploaded
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                status: "error",
                message: "No image uploaded"
            });
        }

        const event = await Event.findById(event_id);
        if (!event) {
            return res.status(404).json({
                status: "error",
                message: "Event not found"
            });
        }

        const savedImages = [];

        // Process each uploaded file
        for (const file of req.files) {
            const timestamp = Date.now();
            const randomNum = Math.floor(Math.random() * 1000000000);
            const newFileName = `event-${timestamp}-${randomNum}.jpg`;
            const newFileDirectory = path.join(__dirname, "../uploads/events/");
            const newFilePath = path.join(newFileDirectory, newFileName);

            if (!fs.existsSync(newFileDirectory)) {
                fs.mkdirSync(newFileDirectory, { recursive: true });
            }

            fs.renameSync(file.path, newFilePath);

            const imageUrl = `${host}/uploads/events/${newFileName}`;

            const newImage = new EventImage({
                imageUrl,
                event: event_id,
                date: date
            });
            const savedImage = await newImage.save();

            event.images.push(savedImage._id);
            savedImages.push(savedImage);
        }

        await event.save();

        return res.status(201).json({
            status: "success",
            message: "Event images added successfully",
            data: savedImages,
        });

    } catch (error) {
        // If there's an error, we should cleanup any files that were uploaded
        if (req.files) {
            req.files.forEach(file => {
                if (fs.existsSync(file.path)) {
                    fs.unlinkSync(file.path);
                }
            });
        }
        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
};

// Delete an event image
exports.deleteEventImage = async (req, res) => {
    try {
        const { id } = req.params;

        const image = await EventImage.findById(id);
        if (!image) {
            return res.status(404).json({ status: "error", message: "Image not found" });
        }

        // Delete file from storage
        const filePath = path.join(__dirname, "../uploads/events", path.basename(image.imageUrl));
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

        // Remove image reference from event
        await Event.findByIdAndUpdate(image.event, { $pull: { images: id } });

        // Delete image from DB
        await EventImage.findByIdAndDelete(id);

        return res.status(200).json({ status: "success", message: "Event image deleted successfully" });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

// Update an event image
exports.updateEventImage = async (req, res) => {
    try {
        const { id } = req.params;

        if (!req.file) {
            return res.status(400).json({ status: "error", message: "No new image provided" });
        }

        const image = await EventImage.findById(id);
        if (!image) {
            return res.status(404).json({ status: "error", message: "Image not found" });
        }

        // Delete old image file
        const oldFilePath = path.join(__dirname, "../uploads/events", path.basename(image.imageUrl));
        if (fs.existsSync(oldFilePath)) fs.unlinkSync(oldFilePath);

        // Save new file
        const timestamp = Date.now();
        const randomNum = Math.floor(Math.random() * 1000000000);
        const newFileName = `event-${timestamp}-${randomNum}.jpg`;
        const newFileDirectory = path.join(__dirname, "../uploads/events/");
        const newFilePath = path.join(newFileDirectory, newFileName);

        if (!fs.existsSync(newFileDirectory)) fs.mkdirSync(newFileDirectory, { recursive: true });

        fs.renameSync(req.file.path, newFilePath);

        const newImageUrl = `${host}/uploads/events/${newFileName}`;

        // Update image in DB
        image.imageUrl = newImageUrl;
        await image.save();

        return res.status(200).json({ status: "success", message: "Event image updated successfully", data: image });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};
