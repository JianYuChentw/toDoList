const tagModel = require('../model/tagModel');
const tools = require('../model/tool');

async function createToDoTag(req, res) {
  const { listId, tagContent } = req.body;
  const token = req.header.Authorization;
  try {
    const access = tools.verifyToken(token);
    const checkPass = await tools.checkUserId(listId);
    if (access === null) {
      return res.json({ loginStatus: false });
    }
    if (isNaN(listId)) {
      return res
        .status(200)
        .json({ createTag: false, message: '輸入非正整數型別' });
    }
    if (checkPass != access.userId || !checkPass) {
      return res.status(200).json({ createTag: false, message: '無此清單' });
    }
    const toDoTagCheak = await tagModel.tagCheckRepeat(listId, tagContent);
    if (!toDoTagCheak) {
      return res
        .status(200)
        .json({ createTag: false, message: '該清單內標籤已重複！' });
    }
    const createTagResult = await tagModel.createTag(listId, tagContent);
    if (!createTagResult) {
      return res
        .status(200)
        .json({ createTag: false, message: '新增發生未預期錯誤' });
    }
    return res.status(200).json({ createTag: true, message: '新增標籤成功' });
  } catch (error) {
    console.error('新增標籤時發生錯誤:', error);
    return res.status(500).json({ createTag: false, message: '伺服器錯誤' });
  }
}

module.exports = {
  createToDoTag,
};
