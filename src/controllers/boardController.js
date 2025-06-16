const Comment = require('../models/CommentModel');
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

        const { tag, title, content } = req.body;

        if (!tag || !title || !content) {
            return res.status(400).json({ message: '태그와 내용을 모두 입력해주세요.' });
        }

        await Board.create({
            tag,
            title,
            content,
            userId
        });

        return res.status(201).json({ message: '게시글이 등록되었습니다.' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: '서버 오류' });
    }
};

// 게시글 개별 조회
exports.getBoardById = async (req, res) => {
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

        const boardId = Number(req.query.id);
        console.log('boardId:', boardId);
        const board = await Board.findOne({ where: { id: boardId } });

        if (!board) {
            return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
        }

        return res.status(200).json({ board });
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

// 고민 게시글 목록 조회
exports.getWorryBorad = async (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if(!token) {
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
            where: {
                tag: '고민'
            },
            order: [['createdAt', 'DESC']] // 최신순
        });

        return res.status(200).json({ boards });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: '서버 오류' });
    }
};

// 질문 게시글 목록 조회
exports.getQuestionBorad = async (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if(!token) {
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
            where: {
                tag: '질문'
            },
            order: [['createdAt', 'DESC']] // 최신순
        });

        return res.status(200).json({ boards });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: '서버 오류' });
    }
};

// top3 게시글 목록 조회
exports.getPopularBorad = async (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if(!token) {
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
            order: [['views', 'DESC']],
            limit: 3
        });

        return res.status(200).json({ boards });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: '서버 오류' });
    }
};

// 나의 게시글 조회 (전체, 고민, 질문)
exports.getMyBoards = async (req, res) => {
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

        const { tag } = req.query;
        let myBoards = [];
        const whereClause = { userId };
        console.log('tag:', tag);
        console.log('whereClause:', whereClause);

        if(tag) {
            if (tag === 'worry') {
                whereClause.tag = '고민';
            } else if (tag === 'question') {
                whereClause.tag = '질문';
            }

            myBoards = await Board.findAll({
                where: whereClause,
                order: [['createdAt', 'DESC']],
            });
        }
        else {
            myBoards = await Board.findAll({
                where: whereClause,
                order: [['createdAt', 'DESC']]
            })
        }

        return res.status(200).json({ boards: myBoards });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: '서버 오류' });
    }
};

// 조회수 상승
exports.increaseViews = async (req, res) => {
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

        // 조회수 1 증가시키기
        board.views += 1;
        await board.save();

        return res.status(200).json({ message: '조회수 증가 완료', views: board.views });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: '서버 오류' });
    }
};

// 게시글 삭제
exports.deleteBoard = async (req, res) => {
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
        
        // 댓글 검색
        await Comment.destroy({ where: { boardId } });

        // 게시글 삭제
        await board.destroy();

        return res.status(200).json({ message: '게시글 삭제 완료' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: '서버 오류' });
    }
};
