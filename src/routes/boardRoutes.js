const express = require('express');
const router = express.Router();
const boardController = require('../controllers/boardController');

router.post('/', boardController.addBoard);
router.get('/', boardController.getBoard);
router.get('/worry', boardController.getWorryBorad);
router.get('/question', boardController.getQuestionBorad);

module.exports = router;