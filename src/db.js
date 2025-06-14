require('dotenv').config({ path: path.resolve(__dirname, 'config/.env') });
const path = require('path');

const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  port: process.env.DB_PORT || 3306,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  dialect: 'mysql',
  logging: false,
});
// 연결 확인
sequelize.authenticate()
  .then(() => {
    console.log('데이터베이스 연결 성공');
  })
  .catch((err) => {
    console.error('데이터베이스 연결 실패:', err);
  });

module.exports = sequelize;  // 다른 파일에서 인스턴스를 사용할 수 있도록 내보내기
