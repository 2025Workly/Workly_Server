const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// 로그인 라우터
router.post('/login', authController.loginUser);

module.exports = router;
