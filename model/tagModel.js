const { connection } = require('../database/data');
const tools = require('../tool');

//取得用戶的tag
async function getTags(userId) {
  try {
    let tags = [];
    //
    const tagQuery = `
    SELECT 
    lt.id AS tagId
    ,lt.tag_content AS tagContent
    FROM 
      list_tag lt
    JOIN 
      list_tag_association lta ON lt.id = lta.tag_id
    JOIN 
      list_data ld ON lta.list_id = ld.id
    WHERE ld.user_id = ?;
    `;

    const [tagRows] = await connection.execute(tagQuery, [userId]);
    if (tagRows.length === 0) return null;

    for (const row of tagRows) {
      const newTag = { id: row.tagId, tagContent: row.tagContent };

      if (!tags.some((tag) => tag.tagContent === newTag.tagContent)) {
        tags.push(newTag);
      }
    }

    console.log(`\u001b[33m`, `取得${userId}的Tag`, `\u001b[37m`);
    return tags;
  } catch (error) {
    console.error('userId搜尋data的tagId失敗:', error);
    throw new Error('userId搜尋data的tagId失敗');
  }
}

//新增tag
async function createTag(tagContent) {
  try {
    const insertQuery = 'INSERT INTO list_tag (tag_content) VALUES (?)';
    const [result] = await connection.execute(insertQuery, [tagContent]);
    console.log(`\u001b[33m`, '新增tag成功', `\u001b[37m`);
    const insertId = result.insertId;
    console.log(`\u001b[33m`, `新增tag的ID：${insertId}`, `\u001b[37m`);
    if (result.affectedRows === 0) {
      return false;
    }
    return insertId;
  } catch (error) {
    console.error('新增tag發錯誤', error);
    throw new Error('data新增tag錯誤');
  }
}

// 新增tag與list中介表
async function addTagListAssociation(listId, tagId) {
  try {
    const insertQuery = `INSERT INTO list_tag_association (list_id, tag_id) VALUES (?, ?)`;
    const result = await connection.query(insertQuery, [listId, tagId]);
    console.log(`\u001b[33m`, '執行tag&list中介表增加', `\u001b[37m`);
    return result.affectedRows > 0;
  } catch (error) {
    console.error('新增tag與list發生錯誤', error);
    throw new Error('data新增tag與list錯誤');
  }
}

//複查清單內有無tag重複
async function checkTagRepeat(listId, tagContent) {
  try {
    const selecttagContent = `
    SELECT
      list_tag.tag_content
    FROM
      list_tag_association
    JOIN
      list_tag ON list_tag_association.tag_id = list_tag.id
    WHERE
      list_tag_association.list_id = ?;
  `;
    const [selectResult] = await connection.query(selecttagContent, [listId]);
    if (selectResult.some((row) => row.tag_content === tagContent)) {
      console.log(`\u001b[31m`, '重複標籤', `\u001b[37m`);
      return false;
    }
    console.log(`\u001b[33m`, '無重複標籤', `\u001b[37m`);
    return true;
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
    const tagQuery = `
        SELECT DISTINCT 
        lta.list_id 
      FROM 
        list_tag_association lta
      JOIN
        list_tag lt ON lta.tag_id = lt.id
      WHERE
        lt.id = ?`;
    const [listId] = await connection.execute(tagQuery, [tagId]);

    if (listId === null) return false;
    for (const row of listId) {
      listIds.push(row.list_id);
    }
    console.log(`\u001b[33m`, '完成tagId對應listId查詢', `\u001b[37m`);

    return { listIds };
  } catch (error) {
    console.error('tag搜尋data的listId失敗:', error);
    throw new Error('tag搜尋data的listId失敗');
  }
}

//確認標籤是否為本人
async function checkTagIsParty(userId, tagId) {
  try {
    const tagDataQuery = `
    SELECT ld.user_id
    FROM list_data ld
    JOIN list_tag_association lta ON ld.id = lta.list_id
    WHERE lta.tag_id = ?;
    `;
    const [tagDataRows] = await connection.execute(tagDataQuery, [tagId]);
    if (tagDataRows.length === 0) {
      return false;
    }
    console.log(
      `\u001b[33m`,
      `${userId === tagDataRows[0].user_id}本人`,
      `\u001b[37m`
    );

    return userId === tagDataRows[0].user_id;
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
  addTagListAssociation,
};
