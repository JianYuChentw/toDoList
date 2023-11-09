const listModel = require('../model/listModel');
const tools = require('../tool');
const tagModel = require('../model/tagModel');

//增新清單
async function createToDoList(req, res) {
  const listTitle = req.body.title;
  const userId = req.user;

  let ErrorResponseResult = { Status: false, message: '伺服器錯誤' };

  try {
    if (listTitle === null || listTitle.length === 0) {
      ErrorResponseResult = { Status: false, message: '清單輸入不得為空' };
      throw new Error('清單輸入不得為空');
    }
    const createResult = await listModel.createList(userId, listTitle);
    if (!createResult) {
      ErrorResponseResult = { Status: false, message: '新增清單失敗' };
      throw new Error('新增清單失敗');
    }
    return res.status(200).json({ Status: true, message: '新增清單成功' });
  } catch (error) {
    console.error('伺服器錯誤:', error);
    return res.status(500).json(ErrorResponseResult);
  }
}

//更新清單
async function updatedToDoList(req, res) {
  const { listId, listTitle } = req.body;
  const userId = req.user;

  let ErrorResponseResult = { Status: false, message: '伺服器錯誤' };

  try {
    if (isNaN(listId) || typeof listId === 'string') {
      ErrorResponseResult = { Status: true, message: '輸入非正整數型別' };
      throw new Error('輸入非正整數型別');
    }
    if (listTitle === null || listTitle.length === 0) {
      ErrorResponseResult = { Status: true, message: '更新清單輸入不得為空' };
      throw new Error('更新清單輸入不得為空');
    }

    const isParty = await listModel.checkIsParty(userId, listId);
    if (!isParty) {
      ErrorResponseResult = { Status: true, message: '無此清單' };
      throw new Error('無此清單');
    }
    const canUpdateResult = await listModel.updatedList(listId, listTitle);
    if (!canUpdateResult) {
      ErrorResponseResult = { Status: true, message: '更新清單成功' };
      throw new Error('更新清單失敗');
    }
    return res.status(200).json({ Status: true, message: '更新清單成功' });
  } catch (error) {
    console.error('更新清單失敗:', error);
    return res.status(500).json(ErrorResponseResult);
  }
}

//模糊搜尋清單
async function searchToDoList(req, res) {
  const { index, desirePpage, desiredQuantity } = req.body;
  const userId = req.user;

  let ErrorResponseResult = { Status: false, message: '伺服器錯誤' };

  try {
    if (index === null || index.length === 0) {
      ErrorResponseResult = { Status: false, message: '更新清單輸入不得為空' };
      throw new Error('更新清單輸入不得為空');
    }

    const lists = await listModel.listFuzzySearch(userId, index);
    if (lists === null) {
      ErrorResponseResult = { Status: false, message: '無相關清單' };
      throw new Error('無相關清單');
    }

    const getList = await listModel.readGiveList(
      lists,
      desirePpage,
      desiredQuantity
    );
    if (!getList) {
      ErrorResponseResult = { Status: false, message: '輸入內容有誤' };
      throw new Error('輸入內容有誤');
    }

    return res.status(200).json({
      loginStatus: true,
      toDoList: getList.rows,
      nowPage: getList.desirePpage,
      totlePage: getList.totalPage,
    });
  } catch (error) {
    console.error('更新清單失敗:', error);
    return res.status(500).json(ErrorResponseResult);
  }
}

// 讀取清單(可指定總頁數及單頁數量)
async function readToDoList(req, res) {
  const { desirePpage, desiredQuantity } = req.body;
  const userId = req.user;

  let ErrorResponseResult = { Status: false, message: '伺服器錯誤' };

  try {
    if (
      isNaN(desirePpage) ||
      typeof desirePpage !== 'number' ||
      isNaN(desiredQuantity) ||
      typeof desiredQuantity !== 'number'
    ) {
      ErrorResponseResult = { Status: false, message: '輸入非正整數型別' };
      throw new Error('輸入非正整數型別');
    }
    //要加入讀取資料
    const listData = await listModel.readList(
      userId,
      desirePpage,
      desiredQuantity
    );
    const userTag = await tagModel.getTags(userId);
    if (!listData) {
      ErrorResponseResult = { Status: false, message: '重新確認目標頁' };
      throw new Error('重新確認目標頁');
    }

    const list = await listData.rows;
    const nowPage = await listData.desirePpage;
    const totlePage = await listData.totalPage;
    return res.status(200).json({
      Status: true,
      tag: userTag,
      toDoList: list,
      nowPage,
      totlePage,
    });
  } catch (error) {
    console.error('取得時發生錯誤:', error);
    return res.status(500).json(ErrorResponseResult);
  }
}

// 刪除清單(含批次)
async function deleteToDoList(req, res) {
  const listId = req.body.listId;
  const userId = req.user;

  let ErrorResponseResult = { Status: false, message: '伺服器錯誤' };

  try {
    const areAllNumbers = listId.every((item) => typeof item === 'number');
    if (!areAllNumbers || listId.length === 0) {
      ErrorResponseResult = { Status: false, message: '輸入非正整數型別' };
      throw new Error('輸入非正整數型別');
    }

    const isParty = await listModel.checkIsParty(userId, listId[0]);
    if (!isParty) {
      ErrorResponseResult = { Status: false, message: '無此清單' };
      throw new Error('無此清單');
    }

    const canDeleteList = await listModel.deleteLists(listId);
    if (!canDeleteList) {
      ErrorResponseResult = { Status: false, message: '刪除清單失敗' };
      throw new Error('刪除清單失敗');
    }

    return res.status(200).json({ Status: true, message: '刪除清單成功' });
  } catch (error) {
    console.error('刪除清單失敗:', error);
    return res.status(500).json(ErrorResponseResult);
  }
}

module.exports = {
  readToDoList,
  createToDoList,
  updatedToDoList,
  deleteToDoList,
  searchToDoList,
};
