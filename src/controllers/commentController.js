const Comment = require('../models/commentModel');
const User = require('../models/userModel');
const Board = require('../models/boardModel');
const jwt = require('jsonwebtoken');

// 댓글 추가
exports.addComment = async (req, res) => {
    const { comment } = req.body;
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

        // 게시글 ID 가져오기
        const boardId = req.params.id;

        // 게시글 검색
        const board = await Board.findOne({ where: { id: boardId } });

        if (!board) {
            return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
        }

        await Comment.create({
            comment,
            boardId,
            userId
        });

        return res.status(200).json({ message: '댓글이 등록되었습니다.' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: '서버 오류' });
    }
};

// 댓글 삭제
exports.getComment = async (req, res) => {
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

        // 게시글 ID 가져오기
        const boardId = req.params.id;

        // 게시글 검색
        const board = await Board.findOne({ where: { id: boardId } });

        if (!board) {
            return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
        }

        const comments = await Comment.findAll({
            where: {
                boardId: boardId
            },
            order: [['createdAt', 'ASC']] // 최신순
        });

        return res.status(200).json({ comments });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: '서버 오류' });
    }
};