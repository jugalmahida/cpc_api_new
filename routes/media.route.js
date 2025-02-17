const express = require("express");
const authMiddleware = require('../middleware/auth');
const mediaController = require("../controllers/media.controller");
const { handleFileUpload } = require('../utils/fileUpload'); // Import the uploadFile middleware

const router = express.Router();

// create
router.post("/create", handleFileUpload("media", { multiple: true, maxCount: 10 }), authMiddleware, mediaController.uploadMedia);

// get all 
router.get("/getAll", mediaController.getAllMedia);

// get by id
router.get("/getById/:id", mediaController.getMediaById);

// delete by id
router.delete("/delete/:id", authMiddleware, mediaController.deleteMedia);

module.exports = router;