const Overtime = require('../models/overtimeModel');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

// 데이트타임 형식인지 확인
function isSQLDateTimeFormat(date) {
    const regex = /^\d{4}-\d{2}-\d{2}$/; 
    return regex.test(date);
}

// 야근 추가하기
exports.addOvertime = (req, res) => {
    const { date } = req.body;
    // Authorization 헤더에서 토큰 추출
    const token = req.headers['authorization']?.split(' ')[1];

    if (!isSQLDateTimeFormat(date)) {
        return res.status(401).json({ message: '날짜 형식이 올바르지 않습니다.' });
    }

    if (!token) {
        return res.status(401).json({ message: '토큰이 없습니다.' });
    }

    // 토큰 검증
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: '유효하지 않은 토큰입니다.' });
        }

        const userId = decoded.userId;

        // 사용자 존재 여부 확인
        User.findUserByUserId(userId, (err, user) => {
            if (err) {
                return res.status(500).json({ message: '서버 오류' });
            }
            if (!user) {
                return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
            }

            // 야근 추가
            Overtime.createOvertimeByuserId(date, userId, (err, result) => {
                if (err) {
                    return res.status(500).json({ message: 'DB 오류' });
                }
                if (result.affectedRows === 0) {
                    return res.status(404).json({ message: '야근 추가 실패' });
                }

                // 성공적으로 추가
                return res.status(200).json({ message: `${date} 야근 추가` });
            });
        });
    });
};

// 야근 목록 불러오기
exports.getMonthOvertime = (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];
    const { year, month } = req.query;

    if (!token) {
        return res.status(401).json({ message: '토큰이 없습니다.' });
    }

    if (!year || !month) {
        return res.status(400).json({ message: '연도와 월을 입력해주세요.' });
    }

    const yearMonth = `${year}-${String(month).padStart(2, '0')}`;

    // 토큰 검증
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: '유효하지 않은 토큰입니다.' });
        }

        const userId = decoded.userId;

        // 사용자 존재 여부 확인
        User.findUserByUserId(userId, (err, results) => {
            if (err || results.length === 0) {
                return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
            }

            // 야근 목록 불러오기
            Overtime.findOvertimeByYearMonth(userId, yearMonth, (err, rows) => {
                if (err) {
                    return res.status(500).json({ message: 'DB 오류' });
                }

                // 날짜를 YYYY-MM-DD 형식으로 변환
                const overtimeDays = rows.map(row =>
                    new Date(row.date).toISOString().slice(0, 10)
                );

                return res.status(200).json({ overtimeDays });
            });
        });
    });
};