const { connection } = require('../data/data');

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

//序列篩選
function sortItemsByOrder(items) {
  // 依照當前序列整理
  items.sort((a, b) => a.itemsSortOder - b.itemsSortOder);

  // 如果有相同的 itemsSortOder，再按 上次更新時間 降序排列
  items.sort((a, b) => {
    if (a.itemsSortOder === b.itemsSortOder) {
      return new Date(b.itemsUpdateTime) - new Date(a.itemsUpdateTime);
    }
    return 0;
  });

  return items;
}

// 新增
async function createItems(listId, itemsTitle) {
  try {
    const selectlistTotal = 'SELECT listTotal FROM listData WHERE id = ?';

    const [selectTotalResult] = await connection.query(selectlistTotal, [
      listId,
    ]);
    const nowlistTotal = selectTotalResult[0].listTotal;

    const insertQuery =
      'INSERT INTO itemsData (listId, itemsTitle, itemsSortOder) VALUES (?, ?, ?)';
    [result] = await connection.execute(insertQuery, [
      listId,
      itemsTitle,
      nowlistTotal + 1,
    ]);

    console.log(result);

    return result.affectedRows === 1;
  } catch (error) {
    console.error('創建項目錯誤:', error);
    return error;
  }
}

// 讀取
async function readItems(listId) {
  try {
    const selectQuery = 'SELECT * FROM itemsData WHERE listId = ?';
    const [rows] = await connection.execute(selectQuery, [listId]);
    const sortFilter = sortItemsByOrder(rows);
    const transformedResults = sortFilter.map((item) => ({
      ...item,
      itemsSchedule: item.itemsSchedule === 1,
      itemsCreateTime: formatDateTime(new Date(item.itemsCreateTime)),
      itemsUpdateTime: formatDateTime(new Date(item.itemsUpdateTime)),
    }));
    console.log(transformedResults);
    if (rows.length > 0) {
      return transformedResults;
    } else {
      return null;
    }
  } catch (error) {
    console.error('讀取項目時發生錯誤:', error);
    return error;
  }
}

// 更新
async function updatedItems(itemsId, itemsTitle) {
  try {
    const updateQuery = 'UPDATE itemsData SET itemsTitle = ? WHERE id = ?';
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
    console.error('更新失敗:', error);
    return error;
  }
}

//更新項目數量
async function updatedItemsSchedule(listId, n) {
  try {
    const selectQuery = 'SELECT listTotal FROM listData WHERE id = ?';
    const [selectResult] = await connection.execute(selectQuery, [listId]);

    if (selectResult.length === 1) {
      const currentTotal = selectResult[0].listTotal;
      const updatedTotal = currentTotal + n;

      const updateQuery = 'UPDATE listData SET listTotal = ? WHERE id = ?';
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
    return error;
  }
}

//項目進度異動(Completed <-> Unfinished)
async function ItemsSchedule(itemId) {
  try {
    const itemsSchedule = 'SELECT itemsSchedule FROM itemsData WHERE id = ?';
    const [itemsScheduleResult] = await connection.execute(itemsSchedule, [
      itemId,
    ]);
    const selectListId = 'SELECT listId FROM itemsData WHERE id = ?';
    const [selectResult] = await connection.execute(selectListId, [itemId]);
    let newSchedule;
    const nowSchedule = itemsScheduleResult[0].itemsSchedule;
    if (nowSchedule === 0) {
      newSchedule = 1;
      const updateQuery =
        'UPDATE listData SET listFinsh = listFinsh + 1 WHERE id = ?';
      const [updateResult] = await connection.execute(updateQuery, [
        selectResult[0].listId,
      ]);
    }
    if (nowSchedule === 1) {
      newSchedule = 0;
      const updateQuery =
        'UPDATE listData SET listFinsh = listFinsh - 1 WHERE id = ?';
      const [updateResult] = await connection.execute(updateQuery, [
        selectResult[0].listId,
      ]);
    }
    const updateQuery = 'UPDATE itemsData SET itemsSchedule = ? WHERE id = ?';
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
    console.error('更新失敗:', error);
    return error;
  }
}

// 刪除
async function deleteItems(itemId) {
  try {
    const selectListId = 'SELECT listId FROM itemsData WHERE id = ?';
    const [selectResult] = await connection.execute(selectListId, [itemId]);
    const deleteQuery = 'DELETE FROM itemsData WHERE id = ?';
    const [result] = await connection.execute(deleteQuery, [itemId]);
    if (result.affectedRows > 0) {
      updatedItemsSchedule(selectResult[0].listId, -1);
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error('刪除失敗:', error);
    return error;
  }
}

//新增項目並異動清單的總項目數
async function createItemsAndListSchedule(listId, itemsTitle) {
  const conn = await connection.getConnection();
  try {
    await conn.beginTransaction();
    const createResult = await createItems(listId, itemsTitle);
    const createItemsQuantityResult = await updatedItemsSchedule(listId, 1);
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
    // 返回伺服器錯誤的響應
    console.log('message: 伺服器錯誤');
    throw error;
  }
}

//項目序列異動
// async function updateSortOrder(id, sortNumber) {
//   try {
//     const updateSort = 'UPDATE itemsData SET itemsSortOder = ? WHERE id = ?';
//     const [updateResult] = await connection.execute(updateSort, [
//       sortNumber,
//       id,
//     ]);
//     if (updateResult.affectedRows > 0) {
//       const selectListId = 'SELECT listId FROM itemsData WHERE id = ?';
//       const [selectResult] = await connection.execute(selectListId, [id]);
//       console.log(selectResult);
//       const newSort = await readItems(selectResult[0].listId);
//       console.log(newSort);
//       return newSort;
//     } else {
//       return false;
//     }
//   } catch (error) {
//     console.error('更新失敗:', error);
//     return error;
//   }
// }

async function updateSortOrder(id, newSortOrder) {
  try {
    const conn = await connection.getConnection();

    // 啟動事務功能
    await conn.beginTransaction();

    // 步骤1：获取当前项目的排序顺序
    const [rows] = await connection.execute(
      'SELECT itemsSortOder, listId FROM itemsData WHERE id = ?',
      [id]
    );

    console.log(rows);

    if (rows.length === 0) {
      throw new Error('未找到项目');
    }

    const currentSortOrder = rows[0].itemsSortOder;
    const listId = rows[0].listId;

    // 步骤2：更新其他项目的排序顺序
    if (newSortOrder < currentSortOrder) {
      await connection.execute(
        'UPDATE itemsData SET itemsSortOder = itemsSortOder + 1 WHERE listId = ? AND itemsSortOder >= ? AND itemsSortOder < ?',
        [listId, newSortOrder, currentSortOrder]
      );
    } else if (newSortOrder > currentSortOrder) {
      await connection.execute(
        'UPDATE itemsData SET itemsSortOder = itemsSortOder - 1 WHERE listId = ? AND itemsSortOder > ? AND itemsSortOder <= ?',
        [listId, currentSortOrder, newSortOrder]
      );
    }

    // 步骤3：更新目标项目的排序顺序
    await connection.execute(
      'UPDATE itemsData SET itemsSortOder = ? WHERE id = ?',
      [newSortOrder, id]
    );

    // 提交事务
    await conn.commit();
    conn.release();
  } catch (error) {
    console.error('调整排序失败:', error);

    // 如果出错，回滚事务
    if (conn) {
      await conn.rollback();
      conn.release();
    }
  }
}

module.exports = {
  createItems,
  readItems,
  updatedItems,
  deleteItems,
  updatedItemsSchedule,
  createItemsAndListSchedule,
  updateSortOrder,
  ItemsSchedule,
};
