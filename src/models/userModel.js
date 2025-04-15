const db = require('../db');

// 사용자 조회 userId
exports.findUserByUserId = (userId, callback) => {
    const sql = 'SELECT * FROM users WHERE userId = ?';
    db.query(sql, [userId], callback);
}

// 사용자 조회 email
exports.findUserByEmail = (email, callback) => {
    const sql = 'SELECT * FROM users WHERE email = ?';
    db.query(sql, [email], callback);
}

// 사용자 추가
exports.createUser = (name, userId, pass, email, callback) => {
    const d = new Date();
    const TIME_ZONE = 9 * 60 * 60 * 1000; // UTC+9 (한국 시간 기준)

    const localTime = new Date(d.getTime() + TIME_ZONE);
    const today = localTime.toISOString().slice(0, 19).replace('T', ' '); // 'YYYY-MM-DD HH:MM:SS'로

    const sql = `INSERT INTO users(name, userId, pass, email, updatedAt, createdAt)
                 VALUES(?, ?, ?, ?, ?, ?)`;

    const values = [name, userId, pass, email, today, today];

    db.query(sql, values, callback);
}

// 사용자 삭제
exports.deleteUser = (userId, callback) => {
    const sql = 'DELETE FROM users WHERE userId = ?';
    db.query(sql, [userId], callback);
}