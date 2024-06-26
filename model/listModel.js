const { connection, escape } = require('../database/data');
const tool = require('../tool');

// 新增
async function createList(userId, listTitle) {
  try {
    const insertQuery =
      'INSERT INTO list_data (user_id, list_title) VALUES (?, ?)';
    const [inserResult] = await connection.execute(insertQuery, [
      userId,
      listTitle,
    ]);
    console.log(`\u001b[33m`, '執行listData新增', `\u001b[37m`);
    return inserResult.affectedRows > 0;
  } catch (error) {
    console.error('創建清單data時發生錯誤:', error);
    throw new Error('創建清單data時發生錯誤');
  }
}

// 讀取（個人全部)
async function readList(id, desirePpage, desiredQuantity) {
  try {
    // 起始行
    const startRow = (desirePpage - 1) * desiredQuantity;

    // 總行數
    const countQuery =
      'SELECT COUNT(*) as totalRows FROM list_data WHERE user_id = ?';
    const [countResult] = await connection.execute(countQuery, [id]);

    // 總頁數
    const totalPage = Math.ceil(countResult[0].totalRows / desiredQuantity);

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
        SELECT JSON_ARRAYAGG(JSON_OBJECT('itemsTitle', items_data.items_title, 'itemsSortOrder', items_data.items_sort_order))
        FROM items_data
        WHERE list_data.id = items_data.list_id
        ORDER BY items_data.items_sort_order
      ) AS toDoitems
      FROM list_data
      WHERE list_data.user_id = ?
      LIMIT ${escape(desiredQuantity)} OFFSET ${escape(startRow)};
    `;

    const [rows] = await connection.execute(selectQuery, [id]);

    if (rows.length > 0) {
      for (const row of rows) {
        if (row.toDoitems) {
          row.toDoitems.sort((a, b) => {
            return a.itemsSortOrder - b.itemsSortOrder;
          });
        }
      }
      console.log('\u001b[33m', '執行取得指定listId相關內容', '\u001b[37m');
      return { rows, desirePpage, totalPage };
    }
    return false;
  } catch (error) {
    console.error('查詢清單data時發生錯誤:', error);
    throw new Error('查詢清單data時發生錯誤');
  }
}

// 讀取（可指定ListId)
async function readGiveList(listIds, desirePpage, desiredQuantity) {
  try {
    const startRow = (desirePpage - 1) * desiredQuantity;
    const listIdString = listIds.join(', ');
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
          SELECT JSON_ARRAYAGG(JSON_OBJECT('itemsTitle', items_data.items_title, 'itemsSortOrder', items_data.items_sort_order))
          FROM items_data
          WHERE list_data.id = items_data.list_id
          ORDER BY items_data.items_sort_order
        ) AS toDoitems
      FROM list_data
      WHERE list_data.id IN (${listIdString})
      LIMIT ${desiredQuantity} OFFSET ${startRow};
    `;

    const [rows] = await connection.execute(selectQuery);

    if (rows.length > 0) {
      for (const row of rows) {
        if (row.toDoitems) {
          row.toDoitems.sort((a, b) => {
            return a.itemsSortOrder - b.itemsSortOrder;
          });
        }
      }

      // 計算行數
      const countQuery = `SELECT COUNT(*) as totalRows FROM list_data WHERE list_data.id IN (${listIdString})`;
      const [countResult] = await connection.execute(countQuery);

      // 計算總頁數
      const totalRows = countResult[0].totalRows;
      const totalPage = Math.ceil(totalRows / desiredQuantity);

      console.log('\u001b[33m', '執行取得指定listId相關內容', '\u001b[37m');

      return { rows, desirePpage, totalPage };
    }

    return false;
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
    console.log(`\u001b[33m`, `執行list${listId}內容更新`, `\u001b[37m`);
    return result.affectedRows > 0;
  } catch (error) {
    console.error('清單data更新失敗:', error);
    throw new Error('清單data更新失敗');
  }
}

// 刪除
async function deleteLists(listIds) {
  try {
    if (listIds.length === 0) {
      return false;
    }
    const listIdsStr = listIds.join(',');
    const deleteQuery = `DELETE FROM list_data WHERE id IN (${listIdsStr})`;
    const [result] = await connection.execute(deleteQuery);
    console.log(`\u001b[33m`, `執行listData${listIds}刪除`, `\u001b[37m`);
    return result.affectedRows > 0;
  } catch (error) {
    console.error('清單data刪除失敗:', error);
    throw new Error('清單data刪除失敗');
  }
}

//確認清單是否為本人
async function checkIsParty(id, listId) {
  try {
    const listDataQuery = 'SELECT user_id FROM list_data WHERE id = ?';
    const [listDataRows] = await connection.execute(listDataQuery, [listId]);

    if (listDataRows && listDataRows.length > 0) {
      const userId = listDataRows[0].user_id;
      console.log(`\u001b[34m`, `完成${id}與${listId}身份比對`, `\u001b[37m`);
      return id === userId;
    }
  } catch (error) {
    console.error('data取得userId時發生錯誤:', error);
    throw new Error('data取得userId時發生錯誤');
  }
}

// 檢索清單
async function listFuzzySearch(userId, index) {
  try {
    let lists = [];
    const listDataQuery = `
      SELECT id
      FROM list_data
      WHERE user_id = ? 
      AND list_title LIKE ?;
    `;
    const [searchResult] = await connection.query(listDataQuery, [
      userId,
      `%${index}%`,
    ]);
    if (searchResult.length === 0) return null;
    searchResult.map((result) => {
      lists.push(result.id);
    });
    return lists;
  } catch (error) {
    console.error('index取得listData時發生錯誤:', error);
    throw new Error('index取得listData時發生錯誤');
  }
}

module.exports = {
  listFuzzySearch,
  createList,
  readList,
  updatedList,
  deleteLists,
  readGiveList,
  checkIsParty,
};
