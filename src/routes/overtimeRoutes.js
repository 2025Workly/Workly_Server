const express = require('express');
const router = express.Router();
const overtimeController = require('../controllers/overtimeController');

router.post('/', overtimeController.addOvertime);

module.exports = router;