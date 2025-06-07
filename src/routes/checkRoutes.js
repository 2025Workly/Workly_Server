const express = require('express');
const router = express.Router();
const checkController = require('../controllers/checkController');

router.post('/', checkController.addCheck);
router.get('/', checkController.getCheckList);
router.patch('/:checkId', checkController.toggleCheck);

module.exports = router;