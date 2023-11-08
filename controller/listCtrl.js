const listModel = require('../model/listModel');
const tools = require('../tool');
const tagModel = require('../model/tagModel');

//增新清單
async function createToDoList(req, res) {
  const listTitle = req.body.title;
  const userId = req.user;
  if (listTitle === null || listTitle.length === 0) {
    return res.json({ Status: true, message: '清單輸入不得為空' });
  }
  try {
    const createResult = await listModel.createList(userId, listTitle);
    if (!createResult) {
      return res.json({ Status: false, message: '新增清單失敗' });
    } else {
      return res.json({ Status: true, message: '新增清單成功' });
    }
  } catch (error) {
    console.error('創建待辦清單失敗:', error);
    return res.status(500).json({ Status: false, message: '伺服器錯誤' });
  }
}

//更新清單
async function updatedToDoList(req, res) {
  const { listId, listTitle } = req.body;
  const userId = req.user;

  if (isNaN(listId) || typeof listId === 'string') {
    return res.status(200).json({ Status: false, message: '輸入非正整數型別' });
  }
  if (listTitle === null || listTitle.length === 0) {
    return res.json({ Status: false, message: '更新清單輸入不得為空' });
  }
  try {
    const isParty = await listModel.checkIsParty(userId, listId);
    if (!isParty) {
      return res.status(200).json({ Status: false, message: '無此清單' });
    }
    const canUpdateResult = await listModel.updatedList(listId, listTitle);
    if (!canUpdateResult) {
      return res.status(200).json({ Status: false, message: '更新清單失敗' });
    } else {
      return res.status(200).json({ Status: true, message: '更新清單成功' });
    }
  } catch (error) {
    console.error('更新清單失敗:', error);
    return res.status(500).json({ Status: false, message: '伺服器錯誤' });
  }
}

//模糊搜尋清單
async function searchToDoList(req, res) {
  const { index, desirePpage, desiredQuantity } = req.body;
  const userId = req.user;
  if (index === null || index.length === 0) {
    return res.json({ Status: false, message: '更新清單輸入不得為空' });
  }
  try {
    const lists = await listModel.listFuzzySearch(userId, index);
    if (lists === null) {
      return res.status(200).json({ Status: false, message: '無相關清單' });
    }

    const getList = await listModel.readGiveList(
      lists,
      desirePpage,
      desiredQuantity
    );
    if (!getList) {
      return res.status(200).json({ Status: false, message: '輸入內容有誤' });
    }
    return res.json({
      loginStatus: true,
      toDoList: getList.rows,
      nowPage: getList.desirePpage,
      totlePage: getList.totalPage,
    });
  } catch (error) {
    console.error('更新清單失敗:', error);
    return res.status(500).json({ Status: false, message: '伺服器錯誤' });
  }
}

// 讀取清單(可指定總頁數及單頁數量)
async function readToDoList(req, res) {
  const { desirePpage, desiredQuantity } = req.body;
  const userId = req.user;
  if (
    isNaN(desirePpage) ||
    typeof desirePpage !== 'number' ||
    isNaN(desiredQuantity) ||
    typeof desiredQuantity !== 'number'
  ) {
    return res.status(200).json({ Status: false, message: '輸入非正整數型別' });
  }
  //要加入讀取資料
  try {
    const listData = await listModel.readList(
      userId,
      desirePpage,
      desiredQuantity
    );
    const userTag = await tagModel.getTags(userId);
    if (!listData) {
      return res.json({ Status: false, message: '重新確認目標頁' });
    }
    const list = await listData.rows;
    const nowPage = await listData.desirePpage;
    const totlePage = await listData.totalPage;
    return res.json({
      Status: true,
      tag: userTag,
      toDoList: list,
      nowPage,
      totlePage,
    });
  } catch (error) {
    console.error('取得時發生錯誤:', error);
    return res.status(500).json({ Status: false, message: '伺服器錯誤' });
  }
}

// 刪除清單(含批次)
async function deleteToDoList(req, res) {
  const listId = req.body.listId;
  const userId = req.user;
  const areAllNumbers = listId.every((item) => typeof item === 'number');
  if (!areAllNumbers || listId.length === 0) {
    return res.status(200).json({ Status: false, message: '輸入非正整數型別' });
  }
  try {
    const isParty = await listModel.checkIsParty(userId, listId[0]);

    if (!isParty) {
      return res.status(200).json({ Status: false, message: '無此清單' });
    }
    const canDeleteList = await listModel.deleteLists(listId);
    if (!canDeleteList) {
      return res.status(200).json({ Status: false, message: '刪除清單失敗' });
    } else {
      return res.status(200).json({ Status: true, message: '刪除清單成功' });
    }
  } catch (error) {
    console.error('刪除清單失敗:', error);
    return res.status(500).json({ Status: false, message: '伺服器錯誤' });
  }
}

module.exports = {
  readToDoList,
  createToDoList,
  updatedToDoList,
  deleteToDoList,
  searchToDoList,
};
