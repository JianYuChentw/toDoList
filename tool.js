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

//時光機 把時間調整正常顯示２４Ｈ
function formatDateTime(inputDateTime) {
  const inputDate = new Date(inputDateTime);

  const year = inputDate.getFullYear();
  const month = String(inputDate.getMonth() + 1).padStart(2, '0');
  const day = String(inputDate.getDate()).padStart(2, '0');
  const hours = String(inputDate.getHours()).padStart(2, '0');
  const minutes = String(inputDate.getMinutes()).padStart(2, '0');
  const seconds = String(inputDate.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

module.exports = {
  makeToken,
  verifyToken,
  formatDateTime,
};
