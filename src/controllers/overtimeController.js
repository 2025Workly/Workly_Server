const Overtime = require('../models/overtimeModel');
const jwt = require('jsonwebtoken');

// 데이트타임 형식인지 확인
function isSQLDateTimeFormat(date) {
    const regex = /^\d{4}-\d{2}-\d{2}$/; 
    return regex.test(date);
}

exports.addOvertime = (req, res) => {
    const { date } = req.body;
    // Authorization 헤더에서 토큰 추출
    const token = req.headers['authorization']?.split(' ')[1];

    if(!isSQLDateTimeFormat(date)) {
        return res.status(401).json({ message: '날짜 형식이 올바르지 않습니다.' });
    }

    if(!token) {
            return res.status(401).json({ message: '토큰이 없습니다.' });
        }
    
        // 토큰 검증
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if(err) {
                return res.status(401).json({ message: '유효하지 않은 토큰입니다.' });
            }
    
            // 토큰 포함된 userId로 추가
            const userId = decoded.userId;
    
            Overtime.createOvertimeByuserId(date, userId, (err, result) => {
                if(err) {
                    return res.status(500).json({ message: 'DB 오류' });
                }
                if(result.affectedRows === 0) {
                    return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
                }
    
                // 성공적으로 추가
                res.status(200).json({ message: `${date} 야근 추가` });
            });
        });
}