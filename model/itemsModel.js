const { connection } = require('../data/data');

// 新增
async function createItems(listId, itemsTitle) {
  try {
    const insertQuery =
      'INSERT INTO itemsData (listId, itemsTitle) VALUES (?, ?)';
    const [result] = await connection.execute(insertQuery, [
      listId,
      itemsTitle,
    ]);
    return result.affectedRows === 1;
  } catch (error) {
    console.error('創建項目錯誤:', error);
    return false;
  }
}

// 讀取
async function readItems(listId) {
  try {
    const selectQuery = 'SELECT * FROM itemsData WHERE listId = ?';
    const [rows] = await connection.execute(selectQuery, [listId]);

    if (rows.length > 0) {
      return rows;
    } else {
      return null;
    }
  } catch (error) {
    console.error('讀取項目時發生錯誤:', error);
    return [];
  }
}

// 更新
async function updatedItems(itemsId, listId, itemsTitle) {
  try {
    const updateQuery =
      'UPDATE itemsData SET itemsTitle = ? WHERE id = ? AND listId = ?';
    const [result] = await connection.execute(updateQuery, [
      itemsTitle,
      itemsId,
      listId,
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
    return false;
  }
}

// 刪除
async function deleteItems([itemsId], listId) {
  try {
    const deleteQuery = 'DELETE FROM itemsData WHERE userId = ? AND id IN (?)';
    const [result] = await connection.execute(deleteQuery, [listId, itemsId]);
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

//新增項目並異動清單的總項目數
async function createItemsAndListSchedule(listId, itemsTitle) {
  const conn = await connection.getConnection();
  try {
    await conn.beginTransaction();
    const createResult = await createItems(listId, itemsTitle);
    const createItemsQuantityResult = await updatedItemsSchedule(listId, 1);
    if (!createResult || !createItemsQuantityResult) {
      await conn.rollback();
      console.log('message: 新增項目失敗');
      return false;
    } else {
      await conn.commit();
      console.log('message: 新增項目成功');
      return true;
    }
  } catch (error) {
    await conn.rollback();
    console.error('創建待辦項目失敗:', error);
    // 返回伺服器錯誤的響應
    console.log('message: 伺服器錯誤');
    throw error;
  }
}

module.exports = {
  createItems,
  readItems,
  updatedItems,
  deleteItems,
  updatedItemsSchedule,
  createItemsAndListSchedule,
};
