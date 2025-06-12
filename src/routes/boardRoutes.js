const express = require('express');
const router = express.Router();
const boardController = require('../controllers/boardController');

router.post('/', boardController.addBoard);
router.get('/:id', boardController.getBoardById);
router.get('/', boardController.getBoard);
router.get('/worry', boardController.getWorryBorad);
router.get('/question', boardController.getQuestionBorad);
router.get('/popular', boardController.getPopularBorad);
router.get('/my', boardController.getMyBoards);
router.post('/:id/views', boardController.increaseViews);
router.delete('/:id', boardController.deleteBoard);

module.exports = router;