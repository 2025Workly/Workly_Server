const express = require('express');
const router = express.Router();
const wordController = require('../controllers/wordController');

router.post('/', wordController.addWord);
router.get('/:id', wordController.getWord)
;
module.exports = router;