const { connection } = require('../data/data');
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

//listId取得userId
async function checkUserId(listId) {
  const listDataQuery = 'SELECT userId FROM listData WHERE id = ?';
  const [listDataRows] = await connection.execute(listDataQuery, [listId]);
  return listDataRows[0].userId;
}

// itemsId取得listId
async function itemsIdcheckUserId(itemsId) {
  const itemsDataQuery = 'SELECT listId FROM itemsData WHERE id = ?';
  const [litemsDataRows] = await connection.execute(itemsDataQuery, [itemsId]);
  console.log(litemsDataRows);
  const listId = litemsDataRows[0].listId;
  return checkUserId(listId);
}

module.exports = {
  makeToken,
  verifyToken,
  checkUserId,
  itemsIdcheckUserId,
};
