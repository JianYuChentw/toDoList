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
    if (result.affectedRows > 0) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error('更新項目data錯誤:', error);
    throw new Error('更新項目data錯誤');
  }
}

//更新項目完成數量
async function updatedItemsFinish(listId, n) {
  try {
    const selectQuery = 'SELECT list_finsh FROM list_data WHERE id = ?';
    const [selectResult] = await connection.execute(selectQuery, [listId]);
    if (selectResult.length === 1) {
      const currentFinsh = selectResult[0].list_finsh;
      const updatedFinsh = currentFinsh + n;

      const updateQuery = 'UPDATE list_data SET list_finsh = ? WHERE id = ?';
      const [updateResult] = await connection.execute(updateQuery, [
        updatedFinsh,
        listId,
      ]);

      if (updateResult.affectedRows > 0) {
        // 表示更新成功
        return updateResult.affectedRows === 1;
      } else {
        // 沒有listId符合對象，更新數量層完成
        return false;
      }
    } else {
      // 沒有listId符合對象
      return false;
    }
  } catch (error) {
    console.error('更新listTotal時，發生錯誤:', error);
    throw new Error('更新listTotal時，發生錯誤');
  }
}

//更新項目總數量
async function updatedItemsTotal(listId, n) {
  try {
    const selectQuery = 'SELECT list_total FROM list_data WHERE id = ?';
    const [selectResult] = await connection.execute(selectQuery, [listId]);
    if (selectResult.length === 1) {
      const currentTotal = selectResult[0].list_total;
      const updatedTotal = currentTotal + n;

      const updateQuery = 'UPDATE list_data SET list_total = ? WHERE id = ?';
      const [updateResult] = await connection.execute(updateQuery, [
        updatedTotal,
        listId,
      ]);

      if (updateResult.affectedRows > 0) {
        // 表示更新成功
        return updateResult.affectedRows === 1;
      } else {
        // 沒有listId符合對象，更新數量層完成
        return false;
      }
    } else {
      // 沒有listId符合對象
      return false;
    }
  } catch (error) {
    console.error('更新listTotal時，發生錯誤:', error);
    throw new Error('更新listTotal時，發生錯誤');
  }
}

//項目進度異動(Completed <-> Unfinished)
async function ItemsSchedule(itemId) {
  try {
    const itemsSchedule = 'SELECT items_schedule FROM items_data WHERE id = ?';
    const [itemsScheduleResult] = await connection.execute(itemsSchedule, [
      itemId,
    ]);
    const selectListId = 'SELECT list_id FROM items_data WHERE id = ?';
    const [selectResult] = await connection.execute(selectListId, [itemId]);
    let newSchedule;
    const nowSchedule = itemsScheduleResult[0].items_schedule;
    if (nowSchedule === 0) {
      newSchedule = 1;
      const updateQuery =
        'UPDATE list_data SET list_finsh = list_finsh + 1 WHERE id = ?';
      const [updateResult] = await connection.execute(updateQuery, [
        selectResult[0].list_id,
      ]);
    }
    if (nowSchedule === 1) {
      newSchedule = 0;
      const updateQuery =
        'UPDATE list_data SET list_finsh = list_finsh - 1 WHERE id = ?';
      const [updateResult] = await connection.execute(updateQuery, [
        selectResult[0].list_id,
      ]);
    }
    const updateQuery = 'UPDATE items_data SET items_schedule = ? WHERE id = ?';
    const [result] = await connection.execute(updateQuery, [
      newSchedule,
      itemId,
    ]);
    if (result.affectedRows > 0) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error('項目進度異動data失敗:', error);
    throw new Error('項目進度異動data失敗發生錯誤');
  }
}

// 刪除
async function deleteItems(itemId) {
  try {
    const selectListId = 'SELECT list_id FROM items_data WHERE id = ?';
    const [selectResult] = await connection.execute(selectListId, [itemId]);
    const list_id = selectResult[0].list_id;
    // 判斷項目是否符合完成
    const selectItemsSchedule =
      'SELECT items_schedule FROM items_data WHERE id = ?';
    const [isItemsFinish] = await connection.execute(selectItemsSchedule, [
      itemId,
    ]);
    // 刪除項目
    const deleteQuery = 'DELETE FROM items_data WHERE id = ?';
    const [result] = await connection.execute(deleteQuery, [itemId]);

    if (result.affectedRows > 0) {
      updatedItemsTotal(list_id, -1);
      //當前項目若為完成，更動完成項目計數器
      if (isItemsFinish.length > 0) {
        updatedItemsFinish(list_id, -1);
      }
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error('刪除項目data發生錯誤:', error);
    throw new Error('刪除項目data發生錯誤');
  }
}

//新增項目並異動清單的總項目數
async function createItemsAndListSchedule(listId, itemsTitle) {
  const conn = await connection.getConnection();
  try {
    await conn.beginTransaction();
    const createResult = await createItems(listId, itemsTitle);
    const createItemsQuantityResult = await updatedItemsTotal(listId, 1);
    if (!createResult || !createItemsQuantityResult) {
      await conn.rollback();
      conn.release();
      console.log('message: 新增項目失敗');
      return false;
    } else {
      await conn.commit();
      conn.release();
      console.log('message: 新增項目成功');
      return true;
    }
  } catch (error) {
    await conn.rollback();
    conn.release();
    console.error('創建待辦項目失敗:', error);
    throw new Error('創建待辦項目失敗');
  }
}

// 異動項目位置(項目id,目標位置)
async function updateSortOrder(id, newSortOrder) {
  const conn = await connection.getConnection();
  try {
    // 啟動事務功能
    await conn.beginTransaction();

    //取得當前項目
    const [rows] = await connection.execute(
      'SELECT items_sort_order, list_id FROM items_data WHERE id = ?',
      [id]
    );

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
  updatedItemsTotal,
  createItemsAndListSchedule,
  updateSortOrder,
  ItemsSchedule,
  updatedOrder,
  getListIdByItemsId,
  updatedItemsFinish,
};
