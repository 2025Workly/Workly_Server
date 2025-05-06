const express = require('express');
const app = express();
require('dotenv').config();
const authRoutes = require('./routes/authRoutes');
const overtimeRoutes = require('./routes/overtimeRoutes');
const boardRoutes = require('./routes/boardRoutes');
const commentRoutes = require('./routes/commentRoutes');

app.use(express.json())

// 라우터 등록
app.use('/user', authRoutes); 
app.use('/overtime', overtimeRoutes);
app.use('/board', boardRoutes);
app.use('/comment', commentRoutes);

app.get('/', (req, res) => {
  res.send('Hello, node!');
});

app.listen(3000, () => {
  console.log('3000번 포트에서 실행 중');
});
