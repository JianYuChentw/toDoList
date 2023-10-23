const itemsModel = require('../model/itemsModel');
const tools = require('../model/tool');

//新增項目
async function createToDoItems(req, res) {
  const { listId, itemsTitle } = req.body;
  const token = req.header.Authorization;
  const access = tools.verifyToken(token);
  if (access === null) {
    return res.json({ loginStatus: false });
  }
  try {
    const createItemsResult = await itemsModel.createItemsAndListSchedule(
      listId,
      itemsTitle
    );
    if (!createItemsResult) {
      return res.json({ createItems: false, message: '新增項目失敗' });
    } else {
      return res.json({ createItems: true, message: '新增項目成功' });
    }
  } catch (error) {
    console.error('創建待辦項目失敗:', error);
    // 返回伺服器錯誤的響應
    return res.status(500).json({ createItems: false, message: '伺服器錯誤' });
  }
}

// 更新項目內容
async function updateToDoItems(req, res) {
  const { itemsTitle, itemsId, listId } = req.body;
  const token = req.header.Authorization;
  const access = tools.verifyToken(token);
  if (access === null) {
    return res.json({ loginStatus: false });
  }
  try {
    const updatedItemsResult = await itemsModel.updatedItems(
      itemsTitle,
      itemsId,
      listId
    );
    if (!updatedItemsResult) {
      return res.json({ updatedItems: false, message: '更新項目失敗' });
    } else {
      return res.json({ updatedItems: true, message: '更新項目成功' });
    }
  } catch (error) {
    console.error('更新待辦項目失敗:', error);
    // 返回伺服器錯誤的響應
    return res.status(500).json({ updatedItems: false, message: '伺服器錯誤' });
  }
}

module.exports = {
  createToDoItems,
  updateToDoItems,
};
