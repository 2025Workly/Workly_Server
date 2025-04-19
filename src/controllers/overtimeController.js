const Overtime = require('../models/overtimeModel');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

function isSQLDateTimeFormat(date) {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    return regex.test(date);
}

// 야근 추가
exports.addOvertime = async (req, res) => {
    const { date } = req.body;
    const token = req.headers['authorization']?.split(' ')[1];

    if (!isSQLDateTimeFormat(date)) {
        return res.status(401).json({ message: '날짜 형식이 올바르지 않습니다.' });
    }

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

        await Overtime.create({ date, userId });

        return res.status(200).json({ message: `${date} 야근 추가` });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: '서버 오류' });
    }
};

// 월별 야근 조회
exports.getMonthOvertime = async (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];
    const { year, month } = req.query;

    if (!token) {
        return res.status(401).json({ message: '토큰이 없습니다.' });
    }

    if (!year || !month) {
        return res.status(400).json({ message: '연도와 월을 입력해주세요.' });
    }

    const yearMonth = `${year}-${String(month).padStart(2, '0')}`;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;

        const user = await User.findOne({ where: { userId } });
        if (!user) {
        return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
        }

        const overtimes = await Overtime.findAll({
        where: {
            userId,
            date: sequelize.where(
            sequelize.fn('DATE_FORMAT', sequelize.col('date'), '%Y-%m'),
            yearMonth
            ),
        },
        });

        const overtimeDays = overtimes.map(o => o.date.toISOString().slice(0, 10));

        return res.status(200).json({ overtimeDays });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: '서버 오류' });
    }
};

// 야근 삭제
exports.deleteOvertime = async (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];
    const { date } = req.body;

    if (!isSQLDateTimeFormat(date)) {
        return res.status(401).json({ message: '날짜 형식이 올바르지 않습니다.' });
    }

    if (!token) {
        return res.status(401).json({ message: '토큰이 없습니다.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;

        
        const user = await User.findOne({ where: { userId } });
            if (!user) {
            return res.status(404).json({ message: '유효하지 않은 사용자 ID입니다' });
            }

            const deletedCount = await Overtime.destroy({
            where: { userId, date },
            });

            if (deletedCount === 0) {
            return res.status(404).json({ message: '해당 날짜의 야근 정보가 없습니다.' });
        }

        return res.status(200).json({ message: `${date}의 야근 정보가 삭제되었습니다.` });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: '서버 오류' });
    }
};
