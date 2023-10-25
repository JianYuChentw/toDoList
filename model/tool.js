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
  try {
    const listDataQuery = 'SELECT userId FROM listData WHERE id = ?';
    const [listDataRows] = await connection.execute(listDataQuery, [listId]);

    if (listDataRows && listDataRows.length > 0) {
      const userId = listDataRows[0].userId;
      return userId;
    } else {
      return null;
    }
  } catch (error) {
    console.error('取得userId時發生錯誤:', error);
    throw error; //
  }
}

// itemsId取得listId
async function itemsIdcheckUserId(itemsId) {
  try {
    const itemsDataQuery = 'SELECT listId FROM itemsData WHERE id = ?';
    const [itemsDataRows] = await connection.execute(itemsDataQuery, [itemsId]);

    if (itemsDataRows && itemsDataRows.length > 0) {
      const listId = itemsDataRows[0].listId;
      return listId;
    } else {
      return null;
    }
  } catch (error) {
    console.error('取得listId時發生錯誤:', error);
    throw error;
  }
}

module.exports = {
  makeToken,
  verifyToken,
  checkUserId,
  itemsIdcheckUserId,
};
