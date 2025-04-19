const Board = require('../models/boardModel');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

// 게시글 추가
exports.addBoard = async (req, res) => {
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

        const { tag, content } = req.body;

        if (!tag || !content) {
            return res.status(400).json({ message: '태그와 내용을 모두 입력해주세요.' });
        }

        await Board.create({
            tag,
            content,
            userId
        });

        return res.status(201).json({ message: '게시글이 등록되었습니다.' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: '서버 오류' });
    }
};

// 게시글 목록 조회
exports.getBoard = async (req, res) => {
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

        const boards = await Board.findAll({
            order: [['createdAt', 'DESC']] // 최신순
        });

        return res.status(200).json({ boards });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: '서버 오류' });
    }
};