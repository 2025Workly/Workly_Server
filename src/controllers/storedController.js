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

// 저장 콘텐츠 목록
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

        const type = req.params.type;       // tip, word
        const subCategory = req.params.sub; // 개발, 디자인, ...

        if (!type) {
            return res.status(400).json({ message: '카테고리를 입력해주세요.' });
        }

        // 현재 유저가 저장한 해당 타입의 콘텐츠 ID 목록 가져오기
        const storedItems = await Stroed.findAll({
            where: { userId, category: type }
        });

        const contentIds = storedItems.map(item => item.contentId);

        let result = [];

        if (type === "tip") {
            const whereClause = { id: contentIds };
            if (subCategory && subCategory !== '전체') {
                whereClause.category = subCategory;
            }

            result = await Tip.findAll({
                where: whereClause,
                order: [['createdAt', 'DESC']]
            });

        } else if (type === "word") {
            const whereClause = { id: contentIds };
            if (subCategory && subCategory !== '전체') {
                whereClause.category = subCategory;
            }

            result = await Word.findAll({
                where: whereClause,
                order: [['createdAt', 'DESC']]
            });

        } else {
            return res.status(400).json({ message: '알 수 없는 콘텐츠 타입입니다.' });
        }

        return res.status(200).json({ data: result });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: '서버 오류' });
    }
};

