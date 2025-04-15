const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// 로그인 라우터
router.post('/login', authController.loginUser);
// 회원가입 라우터
router.post('/join', authController.joinUser);
// 회원탈퇴 라우터
router.delete('/', authController.deleteUser);

module.exports = router;
