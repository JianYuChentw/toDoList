const { connection } = require('./dataBase/data');
const jwt = require('jsonwebtoken');
//! token -----------------------------

// 創建token
function makeToken(payload, expiresIn) {
  // expiresIn表示Token的有效期，可以是數字（秒數）或字符串（例如："1d", "2h", "7d"等）
  return jwt.sign(payload, '1018todolist', { expiresIn });
}

// 驗證 token
function verifyToken(token) {
  try {
    const userKey = jwt.verify(token, '1018todolist');
    return userKey;
  } catch (err) {
    console.log('驗證失敗或Token已過期');
    return null;
  }
}
//123

module.exports = {
  makeToken,
  verifyToken,
};
