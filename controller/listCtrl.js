const listModel = require('../model/listModel');
const tools = require('../model/tool');

//增新清單
async function createToDoList(req, res) {
  const listTitle = req.body.title;
  const token = req.header.Authorization;
  const access = tools.verifyToken(token);
  if (access === null) {
    return res.json({ loginStatus: false });
  }
  try {
    const createResult = await listModel.createList(access.userId, listTitle);
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
  const token = req.header.Authorization;
  const access = tools.verifyToken(token);
  if (access === null) {
    return res.json({ loginStatus: false });
  }
  if (isNaN(listId)) {
    return res
      .status(200)
      .json({ updatedList: false, message: '輸入非正整數型別' });
  }
  try {
    const updateResult = await listModel.updatedList(listId, listTitle);
    if (!updateResult) {
      return res
        .status(200)
        .json({ removeList: false, message: '更新清單失敗' });
    } else {
      return res
        .status(200)
        .json({ removeList: true, message: '更新清單成功' });
    }
  } catch (error) {
    console.error('更新清單失敗:', error);
    return res.status(500).json({ removeList: false, message: '伺服器錯誤' });
  }
}

// 刪除清單(含批次)
async function deleteToDoList(req, res) {
  const listId = req.body.listId;
  const token = req.header.Authorization;
  const access = tools.verifyToken(token);
  const areAllNumbers = listId.every((item) => typeof item === 'number');
  if (access === null) {
    return res.json({ loginStatus: false });
  }
  if (!areAllNumbers) {
    return res
      .status(200)
      .json({ removeList: false, message: '輸入非正整數型別' });
  }
  try {
    const deleteResult = await listModel.deleteList(listId, access.userId);
    if (!deleteResult) {
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
  createToDoList,
  updatedToDoList,
  deleteToDoList,
};
