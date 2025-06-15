const express = require('express');
const router = express.Router();
const checkController = require('../controllers/checkController');

router.post('/', checkController.addCheck);
router.get('/month', checkController.getMonthCheckList);
router.get('/', checkController.getCheckList);
router.patch('/:checkId', checkController.toggleCheck);
router.delete('/:checkId', checkController.deleteCheck);

module.exports = router;