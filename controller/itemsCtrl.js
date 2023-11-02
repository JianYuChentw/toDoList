const itemsModel = require('../model/itemsModel');
const listModel = require('../model/listModel');
const tools = require('../tool');

//新增項目
async function createToDoItems(req, res) {
  const { listId, itemsTitle } = req.body;
  if (itemsTitle.length === 0 || itemsTitle === null) {
    return res.json({ createItems: true, message: '項目輸入不得為空' });
  }
  if (isNaN(listId)) {
    return res
      .status(200)
      .json({ createItems: false, message: '輸入非正整數型別' });
  }
  try {
    const userId = tools.verifyToken(req.session.token).userId;
    const isParty = await listModel.checkIsParty(userId, listId);

    if (!isParty) {
      return res.status(200).json({ createItems: false, message: '無此清單' });
    }
    const canCreateItems = await itemsModel.createItems(listId, itemsTitle);
    if (!canCreateItems) {
      return res.json({ createItems: false, message: '新增項目失敗' });
    } else {
      return res.json({ createItems: true, message: '新增項目成功' });
    }
  } catch (error) {
    console.error('創建待辦項目失敗:', error);
    // 返回伺服器錯誤
    return res.status(500).json({ createItems: false, message: '伺服器錯誤' });
  }
}

//讀取項目(指定清單)
async function readToDoItems(req, res) {
  const { listId } = req.body;

  if (isNaN(listId) || typeof listId === 'string') {
    return res
      .status(200)
      .json({ readedItems: false, message: '輸入非正整數型別' });
  }
  try {
    const userId = tools.verifyToken(req.session.token).userId;
    const isParty = await listModel.checkIsParty(userId, listId);

    if (!isParty) {
      return res.status(200).json({ readedItems: false, message: '無此項目' });
    }
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

// 刪除項目
async function deleteToDoItems(req, res) {
  const itemsId = req.body.itemsId;

  if (isNaN(itemsId) || typeof itemsId === 'string') {
    return res
      .status(200)
      .json({ removeItems: false, message: '輸入非正整數型別' });
  }
  try {
    const userId = tools.verifyToken(req.session.token).userId;
    const listId = await itemsModel.getListIdByItemsId(itemsId);
    const isParty = await listModel.checkIsParty(userId, listId);

    if (!isParty) {
      return res.status(200).json({ removeItems: false, message: '無此項目' });
    }

    const checkHasDeleteItems = await itemsModel.deleteItems(itemsId);
    if (!checkHasDeleteItems) {
      return res
        .status(200)
        .json({ removeItems: false, message: '刪除項目失敗' });
    }
    //刷新序列
    await itemsModel.updatedOrder(listId);
    return res.status(200).json({ removeItems: true, message: '刪除項目成功' });
  } catch (error) {
    console.error('刪除項目失敗:', error);
    return res.status(500).json({ removeItems: false, message: '伺服器錯誤' });
  }
}

// 更新項目內容
async function updateToDoItems(req, res) {
  const { itemsTitle, itemsId } = req.body;
  if (isNaN(itemsId) || typeof itemsId === 'string') {
    return res
      .status(200)
      .json({ updatedItems: false, message: '輸入itemsId非正整數型別' });
  }
  if (itemsTitle.length === 0 || itemsTitle === null) {
    return res.json({ updatedItems: true, message: '更新項目輸入不得為空' });
  }

  try {
    const userId = tools.verifyToken(req.session.token).userId;
    const listId = await itemsModel.getListIdByItemsId(itemsId);
    const isParty = await listModel.checkIsParty(userId, listId);

    if (!isParty) {
      return res.status(200).json({ updatedItems: false, message: '無此項目' });
    }
    const canUpdatedItemsResult = await itemsModel.updatedItems(
      itemsId,
      itemsTitle
    );
    if (!canUpdatedItemsResult) {
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

// 異動項目進度
async function updatedItemsSchedule(req, res) {
  const { itemsId } = req.body;

  if (isNaN(itemsId) || typeof itemsId === 'string') {
    return res
      .status(200)
      .json({ updateSchedule: false, message: '輸入itemsId非正整數型別' });
  }
  try {
    const userId = tools.verifyToken(req.session.token).userId;
    const listId = await itemsModel.getListIdByItemsId(itemsId);
    const isParty = await listModel.checkIsParty(userId, listId);

    if (!isParty) {
      return res
        .status(200)
        .json({ updateSchedule: false, message: '無此項目' });
    }
    const canChangeScheduleItem = await itemsModel.ItemsSchedule(itemsId);
    if (!canChangeScheduleItem) {
      return res.json({ updateSchedule: false, message: '更新項目進度失敗' });
    } else {
      return res.json({ updateSchedule: true, message: '更新項目進度成功' });
    }
  } catch (error) {
    console.error('更新項目進度失敗:', error);
    // 返回伺服器錯誤
    return res
      .status(500)
      .json({ updateSchedule: false, message: '伺服器錯誤' });
  }
}

//項目排序異動
async function changeItemSort(req, res) {
  const { itemsId, sortOrder } = req.body;
  if (
    isNaN(itemsId) ||
    isNaN(sortOrder || sortOrder <= 0 || typeof itemsId === 'string')
  ) {
    return res.status(200).json({
      sortOrderUpdate: false,
      message: '輸入itemsId或sortOrder非正整數型別',
    });
  }
  try {
    const userId = tools.verifyToken(req.session.token).userId;
    const listId = await itemsModel.getListIdByItemsId(itemsId);
    const isParty = await listModel.checkIsParty(userId, listId);

    if (!isParty) {
      return res
        .status(200)
        .json({ sortOrderUpdate: false, message: '無此項目' });
    }
    const canChangeItemsSortOrder = await itemsModel.updateSortOrder(
      itemsId,
      sortOrder
    );
    if (!canChangeItemsSortOrder) {
      return res.json({ sortOrderUpdate: false, message: '更新項目排序失敗' });
    } else {
      return res.json({ sortOrderUpdate: true, message: '更新項目排序成功' });
    }
  } catch (error) {
    console.error('異動待辦項目失敗:', error);
    // 返回伺服器錯誤
    return res
      .status(500)
      .json({ sortOrderUpdate: false, message: '伺服器錯誤' });
  }
}

module.exports = {
  createToDoItems,
  updateToDoItems,
  deleteToDoItems,
  changeItemSort,
  updatedItemsSchedule,
  readToDoItems,
};
