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
async function readList(id) {
  try {
    const selectQuery = `
    SELECT 
    listData.id,
    listData.userId,
    listData.listTitle,
    listData.listFinsh,
    (listData.listTotal - listData.listFinsh) AS itemsUndo,
    listData.listTotal,
    listData.listCreateTime,
    listData.listUpdateTime,
    JSON_ARRAYAGG(
    JSON_OBJECT('itemsTitle', itemsData.itemsTitle)
    ) AS toDoitems
    FROM listData
    LEFT JOIN itemsData ON listData.id = itemsData.listId
    WHERE listData.userId = ?
    GROUP BY listData.id, listData.userId, listData.listTitle, listData.listFinsh, listData.listTotal, listData.listCreateTime, listData.listUpdateTime
    LIMIT 5 OFFSET 0;
    `;

    const [rows] = await connection.execute(selectQuery, [id]);

    if (rows.length > 0) {
      // 如果找到匹配的数据，返回所有行
      return rows;
    } else {
      // 如果没有匹配的数据，返回空数组或其他适当的值
      return [];
    }
  } catch (error) {
    console.error('查询数据时出错:', error);
    return [];
  }
}

// 更新
async function updatedList(listId, listTitle) {
  try {
    const updateQuery = 'UPDATE listData SET listTitle = ? WHERE id = ? ';
    const [result] = await connection.execute(updateQuery, [listTitle, listId]);
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
async function deleteList(listIds) {
  try {
    const results = [];

    for (const listId of listIds) {
      const deleteQuery = 'DELETE FROM listData WHERE id = ?';
      const [result] = await connection.execute(deleteQuery, [listId]);
      results.push(result.affectedRows > 0);
    }
    return results.every((result) => result);
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
