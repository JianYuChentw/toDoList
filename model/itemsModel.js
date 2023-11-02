const { connection } = require('../database/data');
const tool = require('../tool');

// 更新序列
async function updatedOrder(listId) {
  try {
    // 依據listId搜索項目
    const query = `SELECT * FROM items_data WHERE list_id = ? ORDER BY items_sort_order, items_update_time`;

    const [results] = await connection.query(query, [listId]);
    let newSortOrder = 1;
    let hasUpdates = null; // 排序異動紀錄點
    // 搜索序號並更新
    for (const record of results) {
      const currentSortOrder = record.items_sort_order;
      if (currentSortOrder !== newSortOrder) {
        // 如果符合條件但序號有誤，則更新
        const updateQuery =
          'UPDATE items_data SET items_sort_order = ? WHERE list_id = ? AND items_sort_order = ?';
        await connection.query(updateQuery, [
          newSortOrder,
          listId,
          currentSortOrder,
        ]);

        hasUpdates = true; // 有重新排序
      }
      newSortOrder++;
    }

    if (hasUpdates) {
      console.log('分配序號完成');
      return true;
    } else {
      console.log('目前序號無需異動');
      return false;
    }
  } catch (error) {
    console.error('data分配序號發生錯誤:', error);
    throw new Error('data分配序號發生錯誤');
  }
}

//序列篩選
function sortItemsByOrder(items) {
  // 依照當前序列整理
  items.sort((a, b) => a.itemsSortOrder - b.itemsSortOrder);

  // 如果有相同的 itemsSortOder，再按 上次更新時間 降序排列
  items.sort((a, b) => {
    if (a.itemsSortOrder === b.itemsSortOrder) {
      return new Date(b.itemsUpdateTime) - new Date(a.itemsUpdateTime);
    }
    return 0;
  });

  return items;
}

// 新增
async function createItems(listId, itemsTitle) {
  try {
    const selectlistTotal = 'SELECT list_total FROM list_data WHERE id = ?';

    const [selectTotalResult] = await connection.query(selectlistTotal, [
      listId,
    ]);
    const nowlistTotal = selectTotalResult[0].list_total;

    const insertQuery =
      'INSERT INTO items_data (list_id, items_title, items_sort_order) VALUES (?, ?, ?)';
    [result] = await connection.execute(insertQuery, [
      listId,
      itemsTitle,
      nowlistTotal + 1,
    ]);
    console.log(`\u001b[33m`, `執行itemsData新增items`, `\u001b[37m`);
    return result.affectedRows === 1;
  } catch (error) {
    console.error('創建項目data錯誤:', error);
    throw new Error('創建項目data錯誤');
  }
}

// 讀取
async function readItems(listId) {
  try {
    const selectQuery = 'SELECT * FROM items_data WHERE list_id = ?';
    const [rows] = await connection.execute(selectQuery, [listId]);
    const sortFilter = rows;

    const formattedItemsData = sortFilter.map((item) => {
      const formattedCreateTime = tool.formatDateTime(item.items_create_time);
      const formattedUpdateTime = tool.formatDateTime(item.items_update_time);

      return {
        id: item.id,
        listId: item.list_id,
        itemsSortOrder: item.items_sort_order,
        itemsTitle: item.items_title,
        itemsSchedule: item.items_schedule,
        itemsCreateTime: formattedCreateTime,
        itemsUpdateTime: formattedUpdateTime,
      };
    });
    console.log(`\u001b[33m`, `執行${listId}itemsData取得`, `\u001b[37m`);
    if (rows.length > 0) {
      return sortItemsByOrder(formattedItemsData);
    } else {
      return null;
    }
  } catch (error) {
    console.error('讀取項目data時發生錯誤:', error);
    throw new Error('讀取項目data時發生錯誤');
  }
}

// 更新項目內容
async function updatedItems(itemsId, itemsTitle) {
  try {
    const updateQuery = 'UPDATE items_data SET items_title = ? WHERE id = ?';
    const [result] = await connection.execute(updateQuery, [
      itemsTitle,
      itemsId,
    ]);
    console.log(`\u001b[33m`, `執行itemsData${itemsId}內容更新`, `\u001b[37m`);
    return result.affectedRows > 0;
  } catch (error) {
    console.error('更新項目data錯誤:', error);
    throw new Error('更新項目data錯誤');
  }
}

//項目進度異動(Completed <-> Unfinished)
async function ItemsSchedule(itemId) {
  try {
    const updateScheduleQuery = `UPDATE items_data
      SET items_schedule = CASE
          WHEN items_schedule = 0 THEN 1
          WHEN items_schedule = 1 THEN 0
          ELSE items_schedule
      END
      WHERE id = ?`;

    const [canUpdateSchedule] = await connection.execute(updateScheduleQuery, [
      itemId,
    ]);
    console.log(`\u001b[33m`, `執行itemsData${itemId}進度更新`, `\u001b[37m`);
    return canUpdateSchedule.affectedRows > 0;
  } catch (error) {
    console.error('項目進度異動data失敗:', error);
    throw new Error('項目進度異動data失敗發生錯誤');
  }
}

// 刪除
async function deleteItems(itemId) {
  try {
    // 刪除項目
    const deleteQuery = 'DELETE FROM items_data WHERE id = ?';
    const [result] = await connection.execute(deleteQuery, [itemId]);
    console.log(`\u001b[33m`, `完成itemIdData${itemId}刪除`, `\u001b[37m`);
    return result.affectedRows > 0;
  } catch (error) {
    console.error('刪除項目data發生錯誤:', error);
    throw new Error('刪除項目data發生錯誤');
  }
}

// 異動項目位置(項目id,目標位置)
async function updateSortOrder(id, newSortOrder) {
  const conn = await connection.getConnection();
  try {
    // 啟動事務功能
    await conn.beginTransaction();

    // 取得當前最大
    const [getMaxSortOrder] = await connection.execute(
      `SELECT MAX(items_sort_order) AS maxSortOrder
      FROM items_data
      WHERE list_id = (SELECT list_id FROM items_data WHERE id = ?)`,
      [id]
    );
    const MaxSortOrder = getMaxSortOrder[0].maxSortOrder;
    if (MaxSortOrder < newSortOrder) {
      newSortOrder = MaxSortOrder;
    }

    //取得當前項目
    const [rows] = await connection.execute(
      'SELECT items_sort_order, list_id FROM items_data WHERE id = ?',
      [id]
    );

    console.log(rows);

    if (rows.length === 0) {
      throw new Error('無此項目');
    }

    const currentSortOrder = rows[0].items_sort_order;

    const listId = rows[0].list_id;

    // 更新其他項目排序
    if (newSortOrder < currentSortOrder) {
      await connection.execute(
        'UPDATE items_data SET items_sort_order = items_sort_order + 1 WHERE list_id = ? AND items_sort_order >= ? AND items_sort_order < ?',
        [listId, newSortOrder, currentSortOrder]
      );
    } else if (newSortOrder > currentSortOrder) {
      await connection.execute(
        'UPDATE items_data SET items_sort_order = items_sort_order - 1 WHERE list_id = ? AND items_sort_order > ? AND items_sort_order <= ?',
        [listId, currentSortOrder, newSortOrder]
      );
    }
    console.log(
      `\u001b[33m`,
      `執行${id}更換至應${newSortOrder}順位`,
      `\u001b[37m`
    );
    // 更新目標序
    await connection.execute(
      'UPDATE items_data SET items_sort_order = ? WHERE id = ?',
      [newSortOrder, id]
    );

    // 提交事务
    await conn.commit();
    conn.release();
    return true;
  } catch (error) {
    console.error('data異動排序失敗:', error);
    await conn.rollback();
    conn.release();
    throw new Error('data異動排序失敗');
  }
}

// itemsId取得listId
async function getListIdByItemsId(itemsId) {
  try {
    const itemsDataQuery = 'SELECT list_id FROM items_data WHERE id = ?';
    const [itemsDataRows] = await connection.execute(itemsDataQuery, [itemsId]);

    if (itemsDataRows && itemsDataRows.length > 0) {
      const listId = itemsDataRows[0].list_id;
      console.log(`\u001b[34m`, `取得${itemsId}對應listId`, `\u001b[37m`);
      return listId;
    } else {
      return null;
    }
  } catch (error) {
    console.error('data取得listId時發生錯誤:', error);
    throw new Error('data取得listId時發生錯誤');
  }
}

module.exports = {
  createItems,
  readItems,
  updatedItems,
  deleteItems,
  updateSortOrder,
  ItemsSchedule,
  updatedOrder,
  getListIdByItemsId,
};
