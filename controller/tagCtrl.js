const tagModel = require('../model/tagModel');
const tools = require('../tool');
const listModel = require('../model/listModel');

//取得自己標籤
async function getMyTiDoTag(req, res) {
  const userId = req.user;
  try {
    const getToDoTagIds = await tagModel.getTags(userId);
    let ErrorResponseResult = { Status: false, message: '伺服器錯誤' };

    if (!getToDoTagIds) {
      ErrorResponseResult = { Status: false, message: '尚無建立標籤' };
      throw new Error('尚無建立標籤');
    }
    return res.json({ Status: true, tagIds: getToDoTagIds });
  } catch (error) {
    console.error('新增標籤時發生錯誤:', error);
    return res.status(500).json(ErrorResponseResult);
  }
}

//新增tag
async function creatToDoTag(req, res) {
  const { listId, tagContent } = req.body;
  const userId = req.user;

  let responseResult;
  let ErrorResponseResult = { Status: false, message: '伺服器錯誤' };

  try {
    if (isNaN(listId) || typeof listId === 'string') {
      ErrorResponseResult = { Status: false, message: '輸入非正整數型別' };
      throw new Error('輸入非正整數型別');
    }

    if (tagContent === null || tagContent.length === 0) {
      ErrorResponseResult = { Status: false, message: '標籤輸入不得為空' };
      throw new Error('標籤輸入不得為空');
    }

    const checkPass = await listModel.checkIsParty(userId, listId);
    if (!checkPass) {
      ErrorResponseResult = { Status: false, message: '無此清單' };
      throw new Error('無此清單');
    }

    const tagIsRepeat = await tagModel.checkTagRepeat(listId, tagContent);
    if (!tagIsRepeat) {
      ErrorResponseResult = { Status: false, message: '該清單內標籤已重複！' };
      throw new Error('該清單內標籤已重複！');
    }

    // 現有標籤
    let haveRepeatTag = false;
    const nowExistingTag = await tagModel.getTags(userId);
    if (nowExistingTag != null) {
      haveRepeatTag = nowExistingTag.find(
        (tag) => tag.tagContent === tagContent
      );

      //有重複
      if (haveRepeatTag) {
        const matchingTagId = haveRepeatTag.id;
        const addTagListAssociation = await tagModel.addTagListAssociation(
          listId,
          haveRepeatTag.id
        );
        responseResult = { Status: true, message: '加入現有標籤清單' };
      }
    }

    if (!haveRepeatTag || nowExistingTag == null) {
      const canCreateTag = await tagModel.createTag(tagContent);
      if (!canCreateTag) {
        ErrorResponseResult = { Status: false, message: '新增標籤失敗' };
        throw new Error('新增標籤失敗');
      }
      const addTagListAssociation = await tagModel.addTagListAssociation(
        listId,
        canCreateTag
      );
      responseResult = { Status: true, message: '新增標籤成功' };
    }

    return res.status(200).json(responseResult);
  } catch (error) {
    console.error('新增標籤時發生錯誤:', error);
    return res.status(500).json(ErrorResponseResult);
  }
}

// 刪除tag
async function deleteToDoTag(req, res) {
  const tagId = req.body.tagId;
  const userId = req.user;

  let ErrorResponseResult = { Status: false, message: '伺服器錯誤' };

  try {
    if (isNaN(tagId) || typeof tagId === 'string') {
      ErrorResponseResult = { Status: false, message: '輸入非正整數型別' };
      throw new Error('輸入非正整數型別');
    }

    const isParty = await tagModel.checkTagIsParty(userId, tagId);
    if (!isParty) {
      ErrorResponseResult = { Status: false, message: '無此標籤' };
      throw new Error('無此標籤');
    }

    const canDeleteTag = await tagModel.deleteTag(tagId);
    if (!canDeleteTag) {
      ErrorResponseResult = { Status: false, message: '刪除失敗' };
      throw new Error('刪除失敗');
    }

    return res.status(200).json({ Status: true, message: '刪除成功' });
  } catch (error) {
    console.error('新增標籤時發生錯誤:', error);
    return res.status(500).json(ErrorResponseResult);
  }
}

// 讀取tag相關清單
async function readToDoTag(req, res) {
  const { tagId, desirePpage, desiredQuantity } = req.body;
  const userId = req.user;

  let ErrorResponseResult;

  try {
    if (isNaN(tagId) || typeof tagId === 'string') {
      ErrorResponseResult = { Status: false, message: '輸入非正整數型別' };
      throw new Error('輸入非正整數型別');
    }

    const isParty = await tagModel.checkTagIsParty(userId, tagId);
    if (!isParty) {
      ErrorResponseResult = { Status: false, message: '無此標籤' };
      throw new Error('無此標籤');
    }

    const listIds = await tagModel.getListByTag(tagId);
    const getList = await listModel.readGiveList(
      listIds.listIds,
      desirePpage,
      desiredQuantity
    );
    if (!getList) {
      ErrorResponseResult = { Status: false, message: '輸入標籤有誤' };
      throw new Error('輸入標籤有誤');
    }
    return res.json({
      loginStatus: true,
      tagContent: listIds.tagContent,
      toDoList: getList.rows,
      nowPage: getList.desirePpage,
      totlePage: getList.totalPage,
    });
  } catch (error) {
    console.error('讀取標籤相關清單時發生錯誤:', error);
    return res.status(500).json(ErrorResponseResult);
  }
}

module.exports = {
  getMyTiDoTag,
  creatToDoTag,
  deleteToDoTag,
  readToDoTag,
};
