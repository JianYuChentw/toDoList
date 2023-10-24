const tools = require('../model/tool');
const userModel = require('../model/userModel');
const listModel = require('../model/listModel');

// 登入頁
async function toDolistFrontPage(req, res) {
  const token = req.header.Authorization;
  const access = tools.verifyToken(token);
  if (access !== null) {
    return res.json({ loginStatus: true });
  }
  return res.json({ loginStatus: false });
}

// 個人頁
async function MyToDoListPage(req, res) {
  const token = req.header.Authorization;
  const access = tools.verifyToken(token);
  if (access === null) {
    return res.json({ loginStatus: false, message: '非登入狀態' });
  }
  //要加入讀取資料

  try {
    const listData = await listModel.readList(access.userId);
    console.log(listData);
    return res.json({ loginStatus: true, toDoList: listData });
  } catch (error) {
    console.error('取得時發生錯誤:', error);
    return res.status(500).json({ gettoDoList: false, message: '伺服器錯誤' });
  }
}

module.exports = {
  toDolistFrontPage,

  MyToDoListPage,
};
