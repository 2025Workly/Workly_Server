const mysql = require('mysql2');
require('dotenv').config();

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
};

// MySQL 연결 생성
const connection = mysql.createConnection(dbConfig);

// 연결 확인
connection.connect((err) => {
  if (err) {
    console.error('데이터베이스 연결 실패:', err.stack);
    return;
  }
  console.log('데이터베이스 연결 성공');
});

module.exports = connection;  // 다른 파일에서 사용할 수 있도록 내보내기
