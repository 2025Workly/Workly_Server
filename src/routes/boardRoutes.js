const express = require('express');
const router = express.Router();
const boardController = require('../controllers/boardController');

router.post('/', boardController.addBoard);

module.exports = router;