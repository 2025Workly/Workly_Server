const express = require('express');
const router = express.Router();
const boardController = require('../controllers/boardController');

router.post('/', boardController.addBoard);
router.get('/', boardController.getBoard);
router.get('/worry', boardController.getWorryBorad);
router.get('/question', boardController.getQuestionBorad);
router.get('/popular', boardController.getPopularBorad);
router.get('/:id/increaseViews', boardController.increaseViews);

module.exports = router;