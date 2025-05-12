const express = require('express');
const router = express.Router();
const storedController = require('../controllers/storedController');

// 저장 목록 조회
router.get('/:type/:sub', storedController.getStored);
// 저장 여부 확인
router.get('/check/:category/:contentId', storedController.checkStored);
// 저장 or 삭제하는 API (토글)
router.post('/', storedController.toggleStored);

module.exports = router;