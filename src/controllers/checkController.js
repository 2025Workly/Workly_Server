const Check = require('../models/checkModel');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

// 체크리스트 추가
exports.addCheck = async (req, res) => {
    const { content } = req.body;
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: '토큰이 없습니다.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded || !decoded.userId) {
            return res.status(401).json({ message: '유효하지 않은 토큰입니다.' });
        }

        const userId = decoded.userId;

        const user = await User.findOne({ where: { userId } });

        if (!user) {
            return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
        }

        await Check.create({
            content,
            userId,
            checked: 0
        });

        return res.status(200).json({ message: '리스트가 등록되었습니다.' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: '서버 오류' });
    }
};

// 체크리스트 목록
exports.getCheckList = async (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: '토큰이 없습니다.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded || !decoded.userId) {
            return res.status(401).json({ message: '유효하지 않은 토큰입니다.' });
        }

        const userId = decoded.userId;

        const checkList = await Check.findAll({
            where: { userId },
            order: [['createdAt', 'DESC']]
        });

        return res.status(200).json({ checkList });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: '서버 오류' });
    }
};

// 체크리스트 활성/비활성 토글
exports.toggleCheck = async (req, res) => {
    const { checkId } = req.params;
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: '토큰이 없습니다.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;

        const checkItem = await Check.findOne({ where: { id: checkId, userId } });

        if (!checkItem) {
            return res.status(404).json({ message: '체크리스트 항목을 찾을 수 없습니다.' });
        }

        checkItem.checked = checkItem.checked ? 0 : 1;
        await checkItem.save();

        return res.status(200).json({ message: '상태가 변경되었습니다.', checked: checkItem.checked });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: '서버 오류' });
    }
};

// 체크리스트 삭제
exports.deleteCheck = async (req, res) => {
    const { checkId } = req.params;  // 여기서 checkId로 받아야 함
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: '토큰이 없습니다.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;

        const checkItem = await Check.findOne({ where: { id: checkId, userId } });

        if (!checkItem) {
            return res.status(404).json({ message: '체크리스트 항목을 찾을 수 없습니다.' });
        }

        await checkItem.destroy();

        return res.status(200).json({ message: '체크리스트 항목이 삭제되었습니다.' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: '서버 오류' });
    }
};