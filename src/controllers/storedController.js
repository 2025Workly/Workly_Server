const Stroed = require('../models/storedModel');
const Tip = require('../models/tipModel');
const Word = require('../models/wordModel');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

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

// 저장 여부 확인
exports.checkStored = async (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];
    const { contentId, category } = req.params;

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

        const storedContent = await Stroed.findOne({
            where: { userId, category, contentId }
        });

        if (storedContent) {
            return res.status(200).json({ bookmarked: true });
        } else {
            return res.status(200).json({ bookmarked: false });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: '서버 오류' });
    }
};

// 저장하거나 삭제하는 API
exports.toggleStored = async (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];
    const { contentId, category } = req.body;

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

        const storedContent = await Stroed.findOne({
            where: { userId, category, contentId }
        });

        if (storedContent) {
            await storedContent.destroy();  // 이미 저장된 콘텐츠면 삭제
            return res.status(200).json({ message: '콘텐츠가 삭제되었습니다.', bookmarked: false });
        } else {
            await Stroed.create({
                userId,
                category,
                contentId
            });  // 저장되지 않은 콘텐츠는 저장
            return res.status(200).json({ message: '콘텐츠가 저장되었습니다.', bookmarked: true });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: '서버 오류' });
    }
};
