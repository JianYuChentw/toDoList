const tagModel = require('../model/tagModel');
const tools = require('../tool');
const listModel = require('../model/listModel');

//取得自己標籤
async function getMyTiDoTag(req, res) {
  try {
    const userId = tools.verifyToken(req.session.token).userId;
    const getToDoTagIds = await tagModel.getTags(userId);
    if (!getToDoTagIds) {
      return res.json({ getMyTag: false, message: '尚無建立標籤' });
    }
    return res.json({ getMyTag: true, tagIds: getToDoTagIds });
  } catch (error) {
    console.error('新增標籤時發生錯誤:', error);
    return res.status(500).json({ getMyTag: false, message: '伺服器錯誤' });
  }
}

//新增tag
async function creatToDoTag(req, res) {
  const { listId, tagContent } = req.body;
  if (isNaN(listId) || typeof listId === 'string') {
    return res
      .status(200)
      .json({ createTag: false, message: '輸入非正整數型別' });
  }

  if (tagContent === null || tagContent.length === 0) {
    return res.json({ createTag: true, message: '標籤輸入不得為空' });
  }

  try {
    const userId = tools.verifyToken(req.session.token).userId;
    const checkPass = await listModel.checkIsParty(userId, listId);

    if (!checkPass) {
      return res.status(200).json({ createTag: false, message: '無此清單' });
    }
    const tagIsRepeat = await tagModel.checkTagRepeat(listId, tagContent);

    if (!tagIsRepeat) {
      return res
        .status(200)
        .json({ createTag: false, message: '該清單內標籤已重複！' });
    }

    const canCreateTag = await tagModel.createTag(userId, listId, tagContent);
    if (!canCreateTag) {
      return res
        .status(200)
        .json({ createTag: false, message: '新增標籤失敗' });
    }
    return res.status(200).json({ createTag: true, message: '新增標籤成功' });
  } catch (error) {
    console.error('新增標籤時發生錯誤:', error);
    return res.status(500).json({ createTag: false, message: '伺服器錯誤' });
  }
}

// 刪除tag
async function deleteToDoTag(req, res) {
  const tagId = req.body.tagId;
  if (isNaN(tagId) || typeof tagId === 'string') {
    return res
      .status(200)
      .json({ deleteTag: false, message: '輸入非正整數型別' });
  }
  try {
    const userId = tools.verifyToken(req.session.token).userId;
    const isParty = await tagModel.checkTagIsParty(userId, tagId);
    if (!isParty) {
      return res.status(200).json({ deleteTag: false, message: '無此標籤' });
    }
    const canDeleteTag = await tagModel.deleteTag(tagId);
    if (!canDeleteTag) {
      return res.status(200).json({ deleteTag: false, message: '刪除失敗' });
    }
    return res.status(200).json({ deleteTag: true, message: '刪除成功' });
  } catch (error) {
    console.error('新增標籤時發生錯誤:', error);
    return res.status(500).json({ deleteTag: false, message: '伺服器錯誤' });
  }
}

// 讀取tag相關清單
async function readToDoTag(req, res) {
  const { tagId, goalPage } = req.body;
  if (isNaN(tagId) || typeof tagId === 'string') {
    return res
      .status(200)
      .json({ readTag: false, message: '輸入非正整數型別' });
  }
  try {
    const userId = tools.verifyToken(req.session.token).userId;
    const isParty = await tagModel.checkTagIsParty(userId, tagId);
    if (!isParty) {
      return res.status(200).json({ readTag: false, message: '無此標籤' });
    }

    const listIds = await tagModel.getListByTag(tagId);
    const getList = await listModel.readGiveList(listIds.listIds, goalPage);
    if (!getList) {
      return res.status(200).json({ readTag: false, message: '輸入標籤有誤' });
    }
    return res.json({
      loginStatus: true,
      tagContent: listIds.tagContent,
      toDoList: getList.rows,
      nowPage: getList.goalPage,
      totlePage: getList.totlePage,
    });
  } catch (error) {
    console.error('讀取標籤相關清單時發生錯誤:', error);
    return res.status(500).json({ readTag: false, message: '伺服器錯誤' });
  }
}

module.exports = {
  getMyTiDoTag,
  creatToDoTag,
  deleteToDoTag,
  readToDoTag,
};
