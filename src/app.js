const express = require('express');
const app = express();
require('dotenv').config();
const authRoutes = require('./routes/authRoutes');

app.use(express.json())

// 라우터 등록
app.use('/user', authRoutes); 

app.get('/', (req, res) => {
  res.send('Hello, node!');
});

app.listen(3000, () => {
  console.log('3000번 포트에서 실행 중');
});
