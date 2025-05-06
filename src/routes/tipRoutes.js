const express = require('express');
const router = express.Router();
const tipController = require('../controllers/tipController');

router.post('/', tipController.addTip);

module.exports = router;