const Word = require('../models/wordModel');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');

// 단어 추가
exports.addWord = async (req, res) => {
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

        const { category, word, explanation } = req.body;

        if (!category || !word || !explanation) {
            return res.status(400).json({ message: '내용을 모두 입력해주세요.' });
        }

        await Word.create({
            category,
            word,
            explanation,
            userId
        });

        return res.status(201).json({ message: '단어가 등록되었습니다.' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: '서버 오류' });
    }
}

// 단어 목록
exports.getWord = async (req, res) => {
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

        // 카테고리 가져오기
        const category = req.params.id;

        if (!category) {
            return res.status(404).json({ message: '카테고리가 없습니다.' });
        }
        let words = [];

        // 카테고리가 전체일 경우 전부 가져오기
        if(category === "전체") {
            words = await Word.findAll({
                order: [['createdAt', 'DESC']] // 최신순
            });
        }
        else {
            words = await Word.findAll({
                where: {
                    category: category
                },
                order: [['createdAt', 'DESC']] // 최신순
            });
        }

        return res.status(200).json({ words });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: '서버 오류' });
    }
}

// 단어 검색
exports.searchWord = async (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];
    const { keyword } = req.query;

    if(!token) {
        return res.status(401).json({ message: '토큰이 없습니다.' });
    }

    if (!keyword) {
        return res.status(400).json({ message: '검색어를 입력해주세요.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;

        const user = await User.findOne({ where: { userId } });
        if (!user) {
        return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
        }

        const words = await Word.findAll({
            where: {
                word: {
                    [Op.like]: `%${keyword}%`
                }
            },
            order: [['createdAt', 'DESC']] // 최신순
        });

        return res.status(200).json({ words });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: '서버 오류' });
    }
}

// 단어 삭제
exports.deleteWord = async (req, res) => {
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

        // 단어 ID 가져오기
        const wordId = req.params.id;

        // 단어 검색
        const word = await Word.findOne({ where: { id: wordId } });

        if (!word) {
            return res.status(404).json({ message: '단어 ID가 없습니다.' });
        }

        await word.destroy();

        return res.status(200).json({ message: '단어가 삭제되었습니다.' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: '서버 오류' });
    }
}