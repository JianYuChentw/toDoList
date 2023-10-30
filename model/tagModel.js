const { connection } = require('../database/data');
const tools = require('../tool');

//新增tag
async function createTag(listId, tagContent) {
  try {
    const userId = await tools.checkUserId(listId);
    const insertQuery =
      'INSERT INTO list_tag (user_id, list_id,tag_content) VALUES (?, ?, ?)';
    const [result] = await connection.execute(insertQuery, [
      userId,
      listId,
      tagContent,
    ]);
    return result.affectedRows === 1;
  } catch (error) {
    console.error('新增標籤發錯誤', error);
    return error;
  }
}

//tag複查
async function tagCheckRepeat(listId, tagContent) {
  const selecttagContent =
    'SELECT  *  FROM list_tag WHERE  `list_id` = ? and tag_content = ?';
  const [selectResult] = await connection.query(selecttagContent, [
    listId,
    tagContent,
  ]);
  return selectResult.length === 0;
}

//刪除tag
async function deleteTag(tagId) {}

module.exports = {
  createTag,
  tagCheckRepeat,
};
