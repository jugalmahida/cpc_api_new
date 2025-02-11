const express = require('express');
const eventController = require('../controllers/event.controller'); // Import the controller
const { handleFileUpload } = require('../utils/fileUpload'); // Import the uploadFile middleware
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Create a event
router.post('/create', authMiddleware,eventController.createEvent);

// get Event by id
router.get('/getById/:id', eventController.getEventById);

// get all event
router.get('/getAll', eventController.getAllEvents);

// get event by month
router.get('/getByMonth/:eventid/:month', eventController.getEventByMonth);

// update event 
router.put('/update/:id', authMiddleware, eventController.updateEvent);

// delete event 
router.delete('/delete/:id', authMiddleware, eventController.deleteEvent);

// EventImage Routes
// Add Event image by id 
router.post(
    '/addEventImage/:event_id/image',
    authMiddleware,
    handleFileUpload("eventImage", { multiple: true, maxCount: 10 }),
    eventController.addEventImage
);


// delete image by id
router.delete('/deleteEventImage/:id', authMiddleware,eventController.deleteEventImage);

module.exports = router;