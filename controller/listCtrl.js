const listModel = require('../model/listModel');
const tools = require('../tool');

//增新清單
async function createToDoList(req, res) {
  const listTitle = req.body.title;
  if (listTitle === null) {
    return res.json({ createList: true, message: '清單輸入不得為空' });
  }
  try {
    const userId = tools.verifyToken(req.session.token).userId;
    const createResult = await listModel.createList(userId, listTitle);
    if (!createResult) {
      return res.json({ createList: false, message: '新增清單失敗' });
    } else {
      return res.json({ createList: true, message: '新增清單成功' });
    }
  } catch (error) {
    console.error('創建待辦清單失敗:', error);
    return res.status(500).json({ createList: false, message: '伺服器錯誤' });
  }
}

//更新清單
async function updatedToDoList(req, res) {
  const { listId, listTitle } = req.body;

  if (isNaN(listId)) {
    return res
      .status(200)
      .json({ updatedList: false, message: '輸入非正整數型別' });
  }
  if (listTitle === null) {
    return res.json({ updatedList: true, message: '更新清單輸入不得為空' });
  }
  try {
    const userId = tools.verifyToken(req.session.token).userId;
    const isParty = await listModel.checkIsParty(userId, listId);
    if (!isParty) {
      return res.status(200).json({ updatedList: false, message: '無此清單' });
    }
    const canUpdateResult = await listModel.updatedList(listId, listTitle);
    if (!canUpdateResult) {
      return res
        .status(200)
        .json({ updatedList: false, message: '更新清單失敗' });
    } else {
      return res
        .status(200)
        .json({ updatedList: true, message: '更新清單成功' });
    }
  } catch (error) {
    console.error('更新清單失敗:', error);
    return res.status(500).json({ updatedList: false, message: '伺服器錯誤' });
  }
}

// 讀取清單(可指定頁數)
async function readToDoList(req, res) {
  const goalPage = req.body.goalPage;
  if (isNaN(goalPage)) {
    return res
      .status(200)
      .json({ gettoDoList: false, message: '輸入非正整數型別' });
  }
  //要加入讀取資料
  try {
    const userId = tools.verifyToken(req.session.token).userId;
    const listData = await listModel.readList(userId, goalPage);
    if (!listData) {
      return res.json({ gettoDoList: false, message: '重新確認目標頁' });
    }
    const list = await listData.rows;
    const nowPage = await listData.nowPage;
    const totlePage = await listData.totlePage;
    return res.json({ loginStatus: true, toDoList: list, nowPage, totlePage });
  } catch (error) {
    console.error('取得時發生錯誤:', error);
    return res.status(500).json({ gettoDoList: false, message: '伺服器錯誤' });
  }
}

// 刪除清單(含批次)
async function deleteToDoList(req, res) {
  const listId = req.body.listId;

  const areAllNumbers = listId.every((item) => typeof item === 'number');
  if (!areAllNumbers) {
    return res
      .status(200)
      .json({ removeList: false, message: '輸入非正整數型別' });
  }
  try {
    const userId = tools.verifyToken(req.session.token).userId;
    const isParty = await listModel.checkIsParty(userId, listId[0]);

    if (!isParty) {
      return res.status(200).json({ removeList: false, message: '無此清單' });
    }
    const canDeleteList = await listModel.deleteLists(listId);
    if (!canDeleteList) {
      return res
        .status(200)
        .json({ removeList: false, message: '刪除清單失敗' });
    } else {
      return res
        .status(200)
        .json({ removeList: true, message: '刪除清單成功' });
    }
  } catch (error) {
    console.error('刪除清單失敗:', error);
    return res.status(500).json({ removeList: false, message: '伺服器錯誤' });
  }
}

module.exports = {
  readToDoList,
  createToDoList,
  updatedToDoList,
  deleteToDoList,
};
