const express = require('express');
const router = express.Router();
const tipController = require('../controllers/tipController');

router.post('/', tipController.addTip);
router.get('/search', tipController.searchTip);
router.get('/:id', tipController.getTip);

module.exports = router;