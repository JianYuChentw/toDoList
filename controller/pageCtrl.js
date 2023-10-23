const tools = require('../model/tool');
const userModel = require('../model/userModel');

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
  return res.json({ loginStatus: true });
}

module.exports = {
  toDolistFrontPage,

  MyToDoListPage,
};
