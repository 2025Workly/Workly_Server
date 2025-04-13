const express = require('express');
const connection = require('../db');  // DB 연결 가져오기

const app = express();

// 테스트 라우트
app.get('/', (req, res) => {
  res.send('Hello, node!');
});

app.listen(3000, () => {
  console.log('3000번 포트에서 실행 중');
});
