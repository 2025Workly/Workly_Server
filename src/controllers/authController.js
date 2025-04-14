const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.loginUser = (req, res) => {
    const { userId, pass } = req.body;

    //해당 userId를 가진 사용자 조회
    User.findUserByUserId(userId, async (err, result) => {
        if (err) {
            //DB 오류 발생 시 500 응답
            return res.status(500).json({ message: 'DB 오류' });
        }

        if(result.length <= 0) {
            // 아이디 일치 확인
            return res.status(400).json({ message: '유효하지 않은 아이디 입니다' });
        }

        const user = result[0];

        //입력된 비밀번호와 해시된 비밀번호 비교
        const isMatch = await bcrypt.compare(pass, user.pass);
        console.log(pass, user.pass, isMatch); // 디버깅 로그

        if (!isMatch) {
            //비밀번호 불일치 시 401 응답
            return res.status(401).json({ message: '비밀 번호가 일치하지 않습니다' });
        }

        //JWT 토큰 생성 ( 1시간 유효
        const token = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET, { expiresIn: '1h' });

        //로그인 성공 응답
        res.status(200).json({ message: '로그인 성공', token });
    });
}


exports.JoinUser = async (req, res) => {
    const { name, userId, pass, email } = req.body;

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
