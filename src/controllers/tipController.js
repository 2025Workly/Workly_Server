const Tip = require('../models/tipModel');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');

// 팁 추가
exports.addTip = async (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: '토큰이 없습니다.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;

        const user = await User.findOne({ where: { userId } });
        if (!user) {
            return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
        }

        const { category, tip, explanation } = req.body;

        if (!category || !tip || !explanation) {
            return res.status(400).json({ message: '내용을 모두 입력해주세요.' });
        }

        await Tip.create({
            category,
            tip,
            explanation,
            userId
        });

        return res.status(201).json({ message: '팁이 등록되었습니다.' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: '서버 오류' });
    }
}