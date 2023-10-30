const tools = require('../tool');
const listModel = require('../model/listModel');
const itemsModel = require('../model/itemsModel');
const tagModel = require('../model/tagModel');

// 登入頁
async function toDolistFrontPage(req, res) {
  const token = req.session.token;
  const access = tools.verifyToken(token);
  console.log(access);
  if (access !== null) {
    return res.json({ loginStatus: true });
  }
  return res.json({ loginStatus: false });
}

// 個人頁
async function MyToDoListPage(req, res) {
  const token = req.session.token;
  const access = tools.verifyToken(token);
  if (access === null) {
    return res.json({ loginStatus: false, message: '非登入狀態' });
  }
  //要加入讀取資料
  try {
    const listData = await listModel.readList(access.userId, 1);
    const list = await listData.rows;
    const nowPage = await listData.nowPage;
    const totlePage = await listData.totlePage;
    return res.json({ loginStatus: true, toDoList: list, nowPage, totlePage });
  } catch (error) {
    console.error('取得時發生錯誤:', error);
    return res.status(500).json({ gettoDoList: false, message: '伺服器錯誤' });
  }
}

//讀取項目(指定清單)
async function readToDoItems(req, res) {
  const { listId } = req.body;
  const token = req.session.token;
  const access = tools.verifyToken(token);
  const checkPass = await listModel.checkUserId(listId);
  if (access === null) {
    return res.json({ loginStatus: false, message: '非登入狀態' });
  }
  if (isNaN(listId)) {
    return res
      .status(200)
      .json({ readedItems: false, message: '輸入非正整數型別' });
  }
  if (checkPass != access.userId || !checkPass) {
    return res.status(200).json({ readedItems: false, message: '無此項目' });
  }
  try {
    const readItemsResult = await itemsModel.readItems(listId);
    if (!readItemsResult) {
      return res.json({
        readedItems: false,
        message: '讀取項目失敗或清單內無內容',
      });
    } else {
      return res.json({
        loginStatus: true,
        toDoitems: readItemsResult,
      });
    }
  } catch (error) {
    console.error('讀取待辦項目失敗:', error);
    // 返回伺服器錯誤的響應
    return res.status(500).json({ readedItems: false, message: '伺服器錯誤' });
  }
}

// 切換頁
async function switchPage(req, res) {
  const token = req.session.token;
  const access = tools.verifyToken(token);
  const goalPage = req.body.goalPage;
  if (access === null) {
    return res.json({ loginStatus: false, message: '非登入狀態' });
  }
  if (isNaN(goalPage)) {
    return res
      .status(200)
      .json({ gettoDoList: false, message: '輸入非正整數型別' });
  }

  try {
    const listData = await listModel.readList(access.userId, goalPage);
    if (listData.length === 0) {
      return res.json({ gettoDoList: false, message: '無此頁面' });
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

//讀取(依據List)
async function searchList(req, res) {
  const token = req.session.token;
  const access = tools.verifyToken(token);
  if (access === null) {
    return res.json({ loginStatus: false, message: '非登入狀態' });
  }
  //要加入讀取資料
}

module.exports = {
  toDolistFrontPage,
  switchPage,
  MyToDoListPage,
  readToDoItems,
  searchList,
};
