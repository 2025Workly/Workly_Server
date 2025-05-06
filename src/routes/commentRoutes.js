const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');

router.post('/:id', commentController.addComment);
router.get('/:id', commentController.getComment);
router.delete('/:id', commentController.deleteComment);

module.exports = router;