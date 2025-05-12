const express = require('express');
const router = express.Router();
const storedController = require('../controllers/storedController');

router.post('/', storedController.addStored);
router.get('/:type/:sub', storedController.getStored);

module.exports = router;