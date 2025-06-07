const User = require('../models/userModel'); // Sequelize User 모델
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// 유효성 검사 함수
function validateUserId(userId) {
    const regex = /^[a-zA-Z0-9]{5,20}$/;  // 알파벳과 숫자로 5~20자
    return regex.test(userId);
}

function validatePass(pass) {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,20}$/; // 최소 8자, 문자와 숫자 포함
    return regex.test(pass);
}

function validateEmail(email) {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/; // 이메일 형식인지
    return regex.test(email);
}

// 로그인
exports.loginUser = async (req, res) => {
    const { userId, pass } = req.body;

    // 유효성 검사
    if (!userId || !validateUserId(userId)) {
        return res.status(400).json({ message: '유효하지 않은 아이디입니다' });
    }
    if (!pass || !validatePass(pass)) {
        return res.status(400).json({ message: '유효하지 않은 비밀번호입니다' });
    }

    try {
        // 해당 userId를 가진 사용자 조회
        const user = await User.findOne({ where: { userId } });

        if (!user) {
            return res.status(400).json({ message: '유효하지 않은 아이디입니다' });
        }

        // 비밀번호 비교
        const isMatch = await bcrypt.compare(pass, user.pass);

        if (!isMatch) {
            return res.status(401).json({ message: '비밀번호가 일치하지 않습니다' });
        }

        // JWT 토큰 생성 (1일 유효)
        const token = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.status(200).json({ message: '로그인 성공', token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: '서버 오류', error: err });
    }
}

// 회원가입
exports.joinUser = async (req, res) => {
    const { name, userId, pass, email } = req.body;

    // 유효성 검사
    if (!name || name.length < 2 || name.length > 20) {
        return res.status(400).json({ message: '이름은 2~20자여야 합니다.' });
    }
    if (!userId || !validateUserId(userId)) {
        return res.status(400).json({ message: '유효하지 않은 아이디입니다' });
    }
    if (!pass || !validatePass(pass)) {
        return res.status(400).json({ message: '유효하지 않은 비밀번호입니다' });
    }
    if (!email || !validateEmail(email)) {
        return res.status(400).json({ message: '유효하지 않은 이메일입니다' });
    }

    try {
        // userId 중복 체크
        const existingUser = await User.findOne({ where: { userId } });
        if (existingUser) {
            return res.status(400).json({ message: '이미 존재하는 아이디입니다.' });
        }

        // email 중복 체크
        const existingEmail = await User.findOne({ where: { email } });
        if (existingEmail) {
            return res.status(400).json({ message: '이미 존재하는 이메일입니다.' });
        }

        // 비밀번호 해싱
        const hashedPass = await bcrypt.hash(pass, 10);

        // DB에 저장
        await User.create({
            name,
            userId,
            pass: hashedPass,
            email
        });

        res.status(201).json({ message: '회원가입 성공', userId, name, email });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '서버 오류', error });
    }
};

// 유저 삭제
exports.deleteUser = async (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Bearer <token> 형태로 전달

    if (!token) {
        return res.status(401).json({ message: '토큰이 없습니다.' });
    }

    // 토큰 검증
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: '유효하지 않은 토큰입니다.' });
        }

        const userId = decoded.userId;

        try {
            // 사용자 존재 여부 확인
            const user = await User.findOne({ where: { userId } });
            if (!user) {
                return res.status(404).json({ message: '유효하지 않은 사용자 ID입니다' });
            }

            // 사용자 삭제
            await User.destroy({ where: { userId } });

            res.status(200).json({ message: '회원 탈퇴가 완료되었습니다.' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: '서버 오류', error });
        }
    });
};
