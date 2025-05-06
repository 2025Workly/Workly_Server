const express = require('express');
const router = express.Router();
const wordController = require('../controllers/wordController');

router.post('/', wordController.addWord);
router.get('/search', wordController.searchWord);
router.get('/:category', wordController.getWord);

module.exports = router;