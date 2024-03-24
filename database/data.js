const mysql = require('mysql2/promise');
require('dotenv').config();

// 資料庫連線資料
const connection = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

// 測試資料庫連線
async function test_connection() {
  try {
    // 獲取資料庫連線
    const conn = await connection.getConnection();
    // 釋放資料庫連線
    conn.release();
    console.log('成功連線到資料庫');
  } catch (error) {
    console.error('無法連線到資料庫:', error);
  }
}

test_connection();

module.exports = {
  connection,
  escape: mysql.escape,
};
