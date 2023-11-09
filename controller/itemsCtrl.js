const itemsModel = require('../model/itemsModel');
const listModel = require('../model/listModel');
const tools = require('../tool');

//新增項目
async function createToDoItems(req, res) {
  const { listId, itemsTitle } = req.body;
  const userId = req.user;

  let ErrorResponseResult = { Status: false, message: '伺服器錯誤' };

  try {
    if (itemsTitle.length === 0 || itemsTitle === null) {
      ErrorResponseResult = { Status: false, message: '項目輸入不得為空' };
      throw new Error('項目輸入不得為空');
    }
    if (isNaN(listId)) {
      ErrorResponseResult = { Status: false, message: '輸入非正整數型別' };
      throw new Error('輸入非正整數型別');
    }

    const isParty = await listModel.checkIsParty(userId, listId);
    if (!isParty) {
      ErrorResponseResult = { Status: false, message: '無此清單' };
      throw new Error('無此清單');
    }

    const canCreateItems = await itemsModel.createItems(listId, itemsTitle);
    if (!canCreateItems) {
      ErrorResponseResult = { Status: false, message: '新增項目失敗' };
      throw new Error('新增項目失敗');
    }

    return res.status(200).json({ Status: true, message: '新增項目成功' });
  } catch (error) {
    console.error('創建待辦項目失敗:', error);
    // 返回伺服器錯誤
    return res.status(500).json(ErrorResponseResult);
  }
}

//讀取項目(指定清單)
async function readToDoItems(req, res) {
  const listId = req.query.id;
  const userId = req.user;

  let ErrorResponseResult = { Status: false, message: '伺服器錯誤' };

  if (isNaN(listId)) {
    ErrorResponseResult = { Status: false, message: '輸入非正整數型別' };
    throw new Error('輸入非正整數型別');
  }
  try {
    const isParty = await listModel.checkIsParty(userId, listId);
    if (!isParty) {
      ErrorResponseResult = {
        Status: false,
        message: '無此項目',
      };
      throw new Error('無此項目');
    }

    const readItemsResult = await itemsModel.readItems(listId);
    if (!readItemsResult) {
      ErrorResponseResult = {
        Status: false,
        message: '讀取項目失敗或清單內無內容',
      };
      throw new Error('讀取項目失敗或清單內無內容');
    }

    return res.status(200).json({
      Status: true,
      toDoitems: readItemsResult,
    });
  } catch (error) {
    console.error('讀取待辦項目失敗:', error);
    // 返回伺服器錯誤的響應
    return res.status(500).json(ErrorResponseResult);
  }
}

// 刪除項目
async function deleteToDoItems(req, res) {
  const itemsId = req.body.itemsId;
  const userId = req.user;

  let ErrorResponseResult = { Status: false, message: '伺服器錯誤' };

  try {
    if (isNaN(itemsId) || typeof itemsId === 'string') {
      ErrorResponseResult = { Status: false, message: '輸入非正整數型別' };
      throw new Error('輸入非正整數型別');
    }

    const listId = await itemsModel.getListIdByItemsId(itemsId);
    const isParty = await listModel.checkIsParty(userId, listId);

    if (!isParty) {
      ErrorResponseResult = { Status: false, message: '無此項目' };
      throw new Error('無此項目');
    }

    const checkHasDeleteItems = await itemsModel.deleteItems(itemsId);
    if (!checkHasDeleteItems) {
      ErrorResponseResult = { Status: false, message: '刪除項目失敗' };
      throw new Error('刪除項目失敗');
    }

    //刷新序列
    await itemsModel.updatedOrder(listId);

    return res.status(200).json({ Status: true, message: '刪除項目成功' });
  } catch (error) {
    console.error('刪除項目失敗:', error);
    return res.status(500).json(ErrorResponseResult);
  }
}

// 更新項目內容
async function updateToDoItems(req, res) {
  const { itemsTitle, itemsId } = req.body;
  const userId = req.user;

  let ErrorResponseResult = { Status: false, message: '伺服器錯誤' };

  try {
    if (isNaN(itemsId) || typeof itemsId === 'string') {
      ErrorResponseResult = {
        Status: false,
        message: '輸入itemsId非正整數型別',
      };
      throw new Error('輸入itemsId非正整數型別');
    }
    if (itemsTitle.length === 0 || itemsTitle === null) {
      ErrorResponseResult = { Status: true, message: '更新項目輸入不得為空' };
      throw new Error('更新項目輸入不得為空');
    }

    const listId = await itemsModel.getListIdByItemsId(itemsId);
    const isParty = await listModel.checkIsParty(userId, listId);
    if (!isParty) {
      ErrorResponseResult = { Status: false, message: '無此項目' };
      throw new Error('無此項目');
    }

    const canUpdatedItemsResult = await itemsModel.updatedItems(
      itemsId,
      itemsTitle
    );
    if (!canUpdatedItemsResult) {
      ErrorResponseResult = { Status: false, message: '更新項目失敗' };
      throw new Error('更新項目失敗');
    }

    return res.json({ Status: true, message: '更新項目成功' });
  } catch (error) {
    console.error('更新待辦項目失敗:', error);
    // 返回伺服器錯誤的響應
    return res.status(500).json(ErrorResponseResult);
  }
}

// 異動項目進度
async function updatedItemsSchedule(req, res) {
  const { itemsId } = req.body;
  const userId = req.user;

  let ErrorResponseResult = { Status: false, message: '伺服器錯誤' };

  try {
    if (isNaN(itemsId) || typeof itemsId === 'string') {
      ErrorResponseResult = {
        Status: false,
        message: '輸入itemsId非正整數型別',
      };
      throw new Error('輸入itemsId非正整數型別');
    }

    const listId = await itemsModel.getListIdByItemsId(itemsId);
    const isParty = await listModel.checkIsParty(userId, listId);
    if (!isParty) {
      ErrorResponseResult = { Status: false, message: '無此項目' };
      throw new Error('無此項目');
    }

    const canChangeScheduleItem = await itemsModel.ItemsSchedule(itemsId);
    if (!canChangeScheduleItem) {
      ErrorResponseResult = { Status: false, message: '更新項目進度失敗' };
      throw new Error('更新項目進度失敗');
    }
    return res.status(200).json({ Status: true, message: '更新項目進度成功' });
  } catch (error) {
    console.error('更新項目進度失敗:', error);
    // 返回伺服器錯誤
    return res.status(500).json(ErrorResponseResult);
  }
}

//項目排序異動
async function changeItemSort(req, res) {
  const { itemsId, sortOrder } = req.body;
  const userId = req.user;

  let responseResult;
  let ErrorResponseResult = { Status: false, message: '伺服器錯誤' };

  try {
    if (
      isNaN(itemsId) ||
      isNaN(sortOrder || sortOrder <= 0 || typeof itemsId === 'string')
    ) {
      ErrorResponseResult = {
        Status: false,
        message: '輸入itemsId或sortOrder非正整數型別',
      };
      throw new Error('輸入itemsId或sortOrder非正整數型別');
    }

    const listId = await itemsModel.getListIdByItemsId(itemsId);
    const isParty = await listModel.checkIsParty(userId, listId);

    if (!isParty) {
      ErrorResponseResult = {
        Status: false,
        message: '無此項目',
      };
      throw new Error('無此項目');
    }

    const canChangeItemsSortOrder = await itemsModel.updateSortOrder(
      itemsId,
      sortOrder
    );
    if (!canChangeItemsSortOrder) {
      ErrorResponseResult = {
        Status: false,
        message: '更新項目排序失敗',
      };
      throw new Error('更新項目排序失敗');
    }

    return res.status(200).json({ Status: true, message: '更新項目排序成功' });
  } catch (error) {
    console.error('異動待辦項目失敗:', error);
    // 返回伺服器錯誤
    return res.status(500).json(ErrorResponseResult);
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
