const express = require('express');
const router = express.Router();
const overtimeController = require('../controllers/overtimeController');

router.post('/', overtimeController.addOvertime);
router.get('/', overtimeController.getMonthOvertime);
router.delete('/', overtimeController.deleteOvertime);

module.exports = router;