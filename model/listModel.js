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
    return error;
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
    return error; //
  }
}

// 讀取
async function readList(id, nowPage) {
  try {
    // 計算起始行數
    const startRow = (nowPage - 1) * 5;

    //查詢總行數
    const countQuery =
      'SELECT COUNT(*) as totalRows FROM listData WHERE userId = ?';
    const [countResult] = await connection.execute(countQuery, [id]);

    // 換算總頁數
    const totlePage = countResult[0].totalRows / 5;

    //導入起始行數(ex:OFFSET 0為不忽略行數, OFFSET 5 忽略前5行)
    const selectQuery = `
    SELECT 
    listData.id,
    listData.userId,
    listData.listTitle,
    listData.listFinsh,
    (listData.listTotal - listData.listFinsh) AS itemsUndo,
    listData.listTotal,
    DATE_FORMAT(listData.listCreateTime, '%Y-%m-%d %H:%i:%s') AS listCreateTime,
    DATE_FORMAT(listData.listUpdateTime, '%Y-%m-%d %H:%i:%s') AS listUpdateTime,
    JSON_ARRAYAGG(
    JSON_OBJECT('itemsTitle', itemsData.itemsTitle)
    ) AS toDoitems
    FROM listData
    LEFT JOIN itemsData ON listData.id = itemsData.listId
    WHERE listData.userId = ?
    GROUP BY listData.id, listData.userId, listData.listTitle, listData.listFinsh, listData.listTotal, listData.listCreateTime, listData.listUpdateTime
    LIMIT 5 OFFSET ${startRow};
    `;

    const [rows] = await connection.execute(selectQuery, [id]);

    if (rows.length > 0) {
      return { rows, nowPage, totlePage };
    } else {
      return [];
    }
  } catch (error) {
    console.error('查詢時出錯:', error);
    return error;
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
    return error;
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
    return error;
  }
}

module.exports = {
  createList,
  readList,
  updatedList,
  deleteList,
  calculateItems,
};
