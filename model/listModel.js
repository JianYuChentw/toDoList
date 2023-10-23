const { connection } = require('../data/data');

// 數數器
async function calculateItems(listId, schedule) {
  try {
    const countQuery =
      'SELECT COUNT(*) AS count FROM itemsData WHERE listId = ? AND itemsSchedule = ?';
    const [rows] = await connection.execute(countQuery, [listId, schedule]);
    if (rows.length > 0) {
      const count = rows[0].count;
      return count;
    } else {
      return 0;
    }
  } catch (error) {
    console.error('完成度計數器發生錯誤:', error);
    return 0;
  }
}

// 新增
async function createList(userId, listTitle) {
  try {
    const insertQuery =
      'INSERT INTO listData (userId, listTitle) VALUES (?, ?)';
    const [result] = await connection.execute(insertQuery, [userId, listTitle]);
    return true;
  } catch (error) {
    console.error('創建清單錯誤:', error);
    return false; //
  }
}

// 讀取
async function readList(data) {}

// 更新
async function updatedList(listId, userId, listTitle) {
  try {
    const updateQuery =
      'UPDATE listData SET listTitle = ? WHERE id = ? AND userId = ?';
    const [result] = await connection.execute(updateQuery, [
      listTitle,
      listId,
      userId,
    ]);
    console.log(result);
    if (result.affectedRows > 0) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error('更新失敗:', error);
    return false;
  }
}

// 刪除
async function deleteList([listId], userId) {
  try {
    const deleteQuery = 'DELETE FROM listData WHERE userId = ? AND id IN (?)';
    const [result] = await connection.execute(deleteQuery, [userId, listId]);
    if (result.affectedRows > 0) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error('刪除失敗:', error);
    return false;
  }
}

module.exports = {
  createList,
  readList,
  updatedList,
  deleteList,
  calculateItems,
};
