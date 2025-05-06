const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');

router.post('/:id', commentController.addComment);
router.get('/:id', commentController.getComment);

module.exports = router;