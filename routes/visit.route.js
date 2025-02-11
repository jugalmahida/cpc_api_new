const express = require('express');
const router = express.Router();
const { getTotalVisits } = require('../controllers/visit.controller');

router.get('/getCount', getTotalVisits);

module.exports = router;