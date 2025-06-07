const express = require('express');
const router = express.Router();
const checkController = require('../controllers/checkController');

router.post('/', checkController.addCheck);
router.get('/', checkController.getCheckList);

module.exports = router;