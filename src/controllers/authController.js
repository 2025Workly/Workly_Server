const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');

exports.loginUser = (req, res) => {
    const { userId, pass } = req.body;

    User.findUserByUserId(userId, async (err, result) => {
        if (err) return res.status(500).json({ message: 'DB 오류' });

        const user = result[0];
        const isMatch = await pass === user.passWord;
        console.log(pass, user.passWord, isMatch);
        if(!isMatch) {
            return res.status(401).json({ message: '비밀 번호가 일치하지 않습니다' });
        }

        const token = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: '로그인 성공', token });
    })
}