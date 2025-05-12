const express = require('express');
const app = express();
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const overtimeRoutes = require('./routes/overtimeRoutes');
const boardRoutes = require('./routes/boardRoutes');
const commentRoutes = require('./routes/commentRoutes');
const wordRoutes = require('./routes/wordRoutes');
const tipRoutes = require('./routes/tipRoutes');
const storedRoutes = require('./routes/storedRoutes');

app.use(express.json())

// 라우터 등록
app.use('/user', authRoutes);
app.use('/overtime', overtimeRoutes);
app.use('/board', boardRoutes);
app.use('/comment', commentRoutes);
app.use('/words', wordRoutes);
app.use('/tips', tipRoutes);
app.use('/stored', storedRoutes);

app.get('/', (req, res) => {
  res.send('Hello, node!');
});

app.listen(5000, () => {
  console.log('5000번 포트에서 실행 중');
});
