const User = require('../models/userModel');
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

exports.loginUser = (req, res) => {
    const { userId, pass } = req.body;

    // 유효성 검사
    if (!userId || !validateUserId(userId)) {
        return res.status(400).json({ message: '유효하지 않은 아이디입니다' });
    }
    if (!pass || !validatePass(pass)) {
        return res.status(400).json({ message: '유효하지 않은 비밀번호입니다' });
    }

    //해당 userId를 가진 사용자 조회
    User.findUserByUserId(userId, async (err, result) => {
        if (err) {
            //DB 오류 발생 시 500 응답
            return res.status(500).json({ message: 'DB 오류' });
        }

        if(result.length <= 0) {
            // 아이디 불일치 시 400 응답
            return res.status(400).json({ message: '유효하지 않은 아이디입니다' });
        }

        const user = result[0];

        //입력된 비밀번호와 해시된 비밀번호 비교
        const isMatch = await bcrypt.compare(pass, user.pass);
        console.log(pass, user.pass, isMatch); // 디버깅 로그

        if (!isMatch) {
            //비밀번호 불일치 시 401 응답
            return res.status(401).json({ message: '비밀 번호가 일치하지 않습니다' });
        }

        //JWT 토큰 생성 ( 1일 유효)
        const token = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET, { expiresIn: '1d' });

        //로그인 성공 응답
        res.status(200).json({ message: '로그인 성공', token });
    });
}

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
        //userId 중복 체크
        User.findUserByUserId(userId, async (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'DB 오류', error: err });
            }

            if (result.length > 0) {
                return res.status(400).json({ message: '이미 존재하는 아이디입니다.' });
            }

            //email 중복 체크
            User.findUserByEmail(email, async (err, result) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ message: 'DB 오류', error: err });
                }

                if (result.length > 0) {
                    return res.status(400).json({ message: '이미 존재하는 이메일입니다.' });
                }

                //비밀번호 해싱
                const hashedPass = await bcrypt.hash(pass, 10);

                //DB에 저장
                User.createUser(name, userId, hashedPass, email, (err, result) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).json({ message: 'DB 오류', error: err });
                    }

                    //성공 응답
                    res.status(201).json({ message: '회원가입 성공', userId });
                });
            });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '서버 오류', error });
    }
};

exports.deleteUser = (req, res) => {
    // Authorization 헤더에서 토큰을 추출
    const token = req.headers['authorization']?.split(' ')[1]; // Bearer <token> 형태로 전달

    if (!token) {
        return res.status(401).json({ message: '토큰이 없습니다.' });
    }

    // 토큰 검증
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: '유효하지 않은 토큰입니다.' });
        }

        // userId 추출
        const userId = decoded.userId;

        // 사용자 존재 여부 확인
        User.findUserByUserId(userId, (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: '서버 오류' });
            }

            if (!results || results.length === 0) {
                return res.status(404).json({ message: '유효하지 않은 사용자 ID입니다' });
            }

            // 사용자 삭제
            User.deleteUserById(userId, (err, result) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ message: 'DB 오류' });
                }

                if (result.affectedRows === 0) {
                    return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
                }

                // 성공적으로 삭제
                return res.status(200).json({ message: '회원 탈퇴가 완료되었습니다.' });
            });
        });
    });
};
