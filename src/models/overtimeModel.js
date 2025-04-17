const db = require('../db');

exports.createOvertimeByuserId = (date, userId, callback) => {
    const d = new Date();
    const TIME_ZONE = 9 * 60 * 60 * 1000; // UTC+9 (한국 시간 기준)

    const localTime = new Date(d.getTime() + TIME_ZONE);
    const today = localTime.toISOString().slice(0, 19).replace('T', ' '); // 'YYYY-MM-DD HH:MM:SS'로

    const sql = `INSERT INTO overtime(date, userId, updatedAt, createdAt)
                 VALUES(?, ?, ?, ?)`;

    const values = [date, userId, today, today];

    db.query(sql, values, callback);
}