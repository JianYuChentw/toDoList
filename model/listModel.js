const { connection } = require('../database/data');
const tool = require('../tool');

// 數數器
async function calculateItems(listId, schedule) {
  try {
    const countQuery =
      'SELECT COUNT(*) AS count FROM items_data WHERE list_id = ? AND items_schedule = ?';
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
      'INSERT INTO list_data (user_id, list_title) VALUES (?, ?)';
    const [result] = await connection.execute(insertQuery, [userId, listTitle]);
    return true;
  } catch (error) {
    console.error('創建清單data時發生錯誤:', error);
    throw new Error('創建清單data時發生錯誤');
  }
}

// 讀取（可指定目標頁）
async function readList(id, nowPage) {
  try {
    // 計算起始行數
    const startRow = (nowPage - 1) * 5;

    //查詢總行數
    const countQuery =
      'SELECT COUNT(*) as totalRows FROM list_data WHERE user_id = ?';
    const [countResult] = await connection.execute(countQuery, [id]);

    // 換算總頁數
    const totlePage = Math.ceil(countResult[0].totalRows / 5);

    //導入起始行數(ex:OFFSET 0為不忽略行數, OFFSET 5 忽略前5行)
    const selectQuery = `
    SELECT 
    list_data.id,
    list_data.user_id AS userId,
    list_data.list_title AS listTitle,
    list_data.list_finsh AS listFinsh,
    (list_data.list_total - list_data.list_finsh) AS itemsUndo,
    list_data.list_total AS listTotal,
    DATE_FORMAT(list_data.list_create_time, '%Y-%m-%d %H:%i:%s') AS listCreateTime,
    DATE_FORMAT(list_data.list_update_time, '%Y-%m-%d %H:%i:%s') AS listUpdateTime,
    (
        SELECT JSON_ARRAYAGG(JSON_OBJECT('itemsTitle', items_data.items_title))
        FROM items_data
        WHERE list_data.id = items_data.list_id
        ORDER BY items_data.items_sort_order
    ) AS toDoitems
    FROM list_data
    WHERE list_data.user_id = ?
    LIMIT 5 OFFSET ${startRow};

    `;

    const [rows] = await connection.execute(selectQuery, [id]);

    if (rows.length > 0) {
      return { rows, nowPage, totlePage };
    } else {
      return [];
    }
  } catch (error) {
    console.error('查詢目標頁清單data時發生錯誤:', error);
    throw new Error('查詢目標頁清單data時發生錯誤');
  }
}

// 讀取（可指定ListId)
async function readGiveList(listIds, nowPage) {
  try {
    const listIdsString = listIds.join(',');
    // 計算起始行數
    const startRow = (nowPage - 1) * 5;

    // 查詢總行數
    const countResult = [];

    for (const listId of listIds) {
      const deleteQuery =
        'SELECT COUNT(*) as totalRows FROM list_data WHERE id IN (?)';
      const [result] = await connection.execute(deleteQuery, [listId]);
      countResult.push(result[0]);
    }
    // 換算總頁數
    const totalRowsOneCount = countResult.filter(
      (result) => result.totalRows === 1
    ).length;
    const totlePage = Math.ceil(totalRowsOneCount / 5);

    // 導入起始行數(ex:OFFSET 0為不忽略行數, OFFSET 5 忽略前5行)

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
    WHERE listData.id IN (${listIdsString})
    GROUP BY listData.id, listData.userId, listData.listTitle, listData.listFinsh, listData.listTotal, listData.listCreateTime, listData.listUpdateTime
    LIMIT 5 OFFSET ${startRow};
    `;

    const [rows] = await connection.execute(selectQuery);

    if (rows.length > 0) {
      console.log(rows, nowPage, totlePage);

      return { rows, nowPage, totlePage };
    } else {
      return [];
    }
  } catch (error) {
    console.error('查詢清單data時發生錯誤:', error);
    throw new Error('查詢清單data時發生錯誤');
  }
}

// 更新
async function updatedList(listId, listTitle) {
  try {
    const updateQuery = 'UPDATE list_data SET list_title = ? WHERE id = ? ';
    const [result] = await connection.execute(updateQuery, [listTitle, listId]);
    console.log(result);
    if (result.affectedRows > 0) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error('清單data更新失敗:', error);
    throw new Error('清單data更新失敗');
  }
}

// 刪除
async function deleteList(listIds) {
  try {
    const results = [];

    for (const listId of listIds) {
      const deleteQuery = 'DELETE FROM list_data WHERE id = ?';
      const [result] = await connection.execute(deleteQuery, [listId]);
      results.push(result.affectedRows > 0);
    }
    return results.every((result) => result);
  } catch (error) {
    console.error('清單data刪除失敗:', error);
    throw new Error('清單data刪除失敗');
  }
}

//listId取得userId
async function checkUserId(listId) {
  try {
    const listDataQuery = 'SELECT user_id FROM list_data WHERE id = ?';
    const [listDataRows] = await connection.execute(listDataQuery, [listId]);

    if (listDataRows && listDataRows.length > 0) {
      const userId = listDataRows[0].user_id;
      return userId;
    } else {
      return null;
    }
  } catch (error) {
    console.error('data取得userId時發生錯誤:', error);
    throw new Error('data取得userId時發生錯誤');
  }
}

module.exports = {
  createList,
  readList,
  updatedList,
  deleteList,
  calculateItems,
  readGiveList,
  checkUserId,
};
