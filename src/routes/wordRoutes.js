const express = require('express');
const router = express.Router();
const wordController = require('../controllers/wordController');

router.post('/', wordController.addWord);
router.get('/search', wordController.searchWord);
router.get('/:id', wordController.getWord);
router.delete('/:id', wordController.deleteWord);

module.exports = router;