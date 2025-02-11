const express = require("express");
const router = express.Router();
const announcementController = require("../controllers/announment.controller");
const { handleFileUpload } = require("../utils/fileUpload");
const authMiddleware = require('../middleware/auth');

// Create
router.post("/create", authMiddleware, handleFileUpload("announcementFile"), announcementController.createAnnouncement);

// get all announment 
router.get("/getAll", announcementController.getAllAnnouncements);

// get by id
router.get("/getByID/:id", announcementController.getAnnouncementById);

// Get by date (YYYY-MM-DD)
router.get("/date/:date", announcementController.getAnnouncementsByDate);

// Get by month (YYYY, MM)
router.get("/month/:year/:month", announcementController.getAnnouncementsByMonth); 

// update by id 
router.put("/update/:id", authMiddleware, handleFileUpload("announcementFile",{multiple:true,maxCount:5}), announcementController.updateAnnouncement);

// delete by id
router.delete("/delete/:id", authMiddleware, announcementController.deleteAnnouncement);

module.exports = router;
