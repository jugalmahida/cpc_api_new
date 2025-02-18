const express = require('express');
const router = express.Router();
const visitController = require('../controllers/visit.controller');

router.get('/getCount', visitController.getTotalVisits);

// Increment the counter
router.get("/incrementCount", visitController.incrementVisitCount);

module.exports = router;