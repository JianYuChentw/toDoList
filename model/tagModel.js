const { connection } = require('../database/data');
const tools = require('../tool');

//取得用戶的tag
async function getTags(userId) {
  try {
    let tags = [];
    const tagQuery = `SELECT id, tag_content
    FROM list_tag
    WHERE user_id = ?`;

    const [tagRows] = await connection.execute(tagQuery, [userId]);
    if (tagRows === null) return false;

    for (const row of tagRows) {
      tags.push({ id: row.id, tag_content: row.tag_content });
    }

    return tags;
  } catch (error) {
    console.error('userId搜尋data的tagId失敗:', error);
    throw new Error('userId搜尋data的tagId失敗');
  }
}

//新增tag
async function createTag(userId, listId, tagContent) {
  try {
    const insertQuery =
      'INSERT INTO list_tag (user_id, list_id,tag_content) VALUES (?, ?, ?)';
    const [result] = await connection.execute(insertQuery, [
      userId,
      listId,
      tagContent,
    ]);
    console.error('新增tag成功');
    return result.affectedRows === 1;
  } catch (error) {
    console.error('新增tag發錯誤', error);
    throw new Error('data新增tag錯誤');
  }
}

//tag複查
async function checkTagRepeat(listId, tagContent) {
  try {
    const selecttagContent =
      'SELECT  *  FROM list_tag WHERE  `list_id` = ? and tag_content = ?';
    const [selectResult] = await connection.query(selecttagContent, [
      listId,
      tagContent,
    ]);
    return selectResult.length === 0;
  } catch (error) {
    console.error('data查詢tag重複錯誤:', error);
    // 返回伺服器錯誤
    throw new Error('data查詢tag重複錯誤');
  }
}

//刪除tag
async function deleteTag(tagId) {
  try {
    const deleteQuery = `DELETE FROM list_tag WHERE id = ?`;
    const [result] = await connection.execute(deleteQuery, [tagId]);
    return result.affectedRows > 0;
  } catch (error) {
    console.error('data刪除tag失敗:', error);
    throw new Error('data刪除tag失敗');
  }
}

// 取得含有tag的listId
async function getListByTag(tagId) {
  try {
    let listIds = [];
    const tagQuery = `SELECT DISTINCT list_id
    FROM list_tag
    WHERE tag_content = (
        SELECT tag_content
        FROM list_tag
        WHERE id = ?
    )`;
    const [listId] = await connection.execute(tagQuery, [tagId]);

    if (listId === null) return false;
    for (const row of listId) {
      listIds.push(row.list_id);
    }
    console.log(listIds);
    return listIds;
  } catch (error) {
    console.error('tag搜尋data的listId失敗:', error);
    throw new Error('tag搜尋data的listId失敗');
  }
}

//確認標籤是否為本人
async function checkTagIsParty(userId, tagId) {
  try {
    const tagDataQuery = 'SELECT user_id FROM list_tag WHERE id = ?';
    const [tagDataRows] = await connection.execute(tagDataQuery, [tagId]);

    if (tagDataRows && tagDataRows.length > 0) {
      const tagDataUserId = tagDataRows[0].user_id;

      return userId === tagDataUserId;
    }
  } catch (error) {
    console.error('data取得userId時發生錯誤:', error);
    throw new Error('data取得userId時發生錯誤');
  }
}

module.exports = {
  createTag,
  checkTagRepeat,
  deleteTag,
  checkTagIsParty,
  getListByTag,
  getTags,
};
