const express = require('express');
const cors = require('cors');  // cors 모듈 import
const app = express();
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const overtimeRoutes = require('./routes/overtimeRoutes');
const boardRoutes = require('./routes/boardRoutes');
const commentRoutes = require('./routes/commentRoutes');
const wordRoutes = require('./routes/wordRoutes');
const tipRoutes = require('./routes/tipRoutes');
const storedRoutes = require('./routes/storedRoutes');
const checkRoutes = require('./routes/checkRoutes');

const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: 'http://localhost:3000', // Next.js 클라이언트 주소
  credentials: true,               // 쿠키 같이 전송할 경우 필요
}));

app.use(express.json());

// 라우터 등록
app.use('/user', authRoutes);
app.use('/overtime', overtimeRoutes);
app.use('/board', boardRoutes);
app.use('/comment', commentRoutes);
app.use('/words', wordRoutes);
app.use('/tips', tipRoutes);
app.use('/stored', storedRoutes);
app.use('/check', checkRoutes);

app.get('/', (req, res) => {
  res.send('Hello, node!');
});

app.listen(PORT, () => {
  console.log(`${PORT}번 포트에서 실행 중`);
});
 