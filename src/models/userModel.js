const db = require('../db');

exports.findUserByUserId = (userId, callback) => {
    const sql = 'SELECT * FROM users WHERE userId = ?';

    db.query(sql, [userId], callback);
}