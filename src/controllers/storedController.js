const Stroed = require('../models/storedModel');
const Tip = require('../models/tipModel');
const Word = require('../models/wordModel');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

// 저장 콘텐츠 추가
exports.addStored = async (req, res) => {
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

        const { category, contentId } = req.body;

        if (!category || !contentId) {
            return res.status(400).json({ message: '내용을 모두 입력해주세요.' });
        }

        await Stroed.create({
            userId,
            category,
            contentId
        });

        return res.status(201).json({ message: '콘텐츠가 저장되었습니다.' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: '서버 오류' });
    }
}

// 저장 목록
exports.getStored = async (req, res) => {
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

        const category = req.params.id;
        if (!category) {
            return res.status(400).json({ message: '카테고리가 없습니다.' });
        }

        const storedItems = await Stroed.findAll({
            where: category === '전체' ? { userId } : { userId, category }
        });

        const contentList = [];

        for (const item of storedItems) {
            if (item.category === 'tip') {
                const tip = await Tip.findOne({ where: { id: item.contentId } });
                if (tip) contentList.push(tip);
            } else if (item.category === 'word') {
                const word = await Word.findOne({ where: { id: item.contentId } });
                if (word) contentList.push(word);
            }
        }

        return res.status(200).json({ contents: contentList });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: '서버 오류' });
    }
};
