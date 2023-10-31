const tools = require('../tool');
const listModel = require('../model/listModel');
const itemsModel = require('../model/itemsModel');
const tagModel = require('../model/tagModel');

// 切換頁
async function switchPage(req, res) {
  const goalPage = req.body.goalPage;
  if (isNaN(goalPage)) {
    return res
      .status(200)
      .json({ gettoDoList: false, message: '輸入非正整數型別' });
  }
  try {
    const userId = tools.verifyToken(req.session.token).userId;
    const listData = await listModel.readList(userId, goalPage);
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

module.exports = {
  switchPage,
};
