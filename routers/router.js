const express = require('express');
const router = express.Router();
const toDoListPage = require('../controller/pageCtrl');
const toDoList = require('../controller/listCtrl');
const toDoitems = require('../controller/itemsCtrl');
const user = require('../controller/userCtrl');
const toDoTag = require('../controller/tagCtrl');
const tools = require('../tool');

function canUserFunctionMiddleware(req, res, next) {
  const token = req.session.token;
  const user = tools.verifyToken(token);
  if (user === null) {
    return res.json({ loginStatus: false, message: '非登入狀態' });
  }
  next();
}

/ 頁面 /;
//登入頁 pass
router.get('/LoginMyToDoListPage', toDoListPage.toDolistFrontPage);

//註冊頁
router.get('/registerMyToDoListPage');

//個人to-do list
router.get(
  '/MyToDoList',
  canUserFunctionMiddleware,
  toDoListPage.MyToDoListPage
);

//個人to-do items(清單頁內)
router.get(
  '/MyToDoListShow',
  canUserFunctionMiddleware,
  toDoListPage.readToDoItems
);

/ 頁面功能 /;
//登入 pass
router.post('/LoginMyToDoList', user.login);

//登出
router.get('/LogOutMyToDoList', canUserFunctionMiddleware, user.logOut);

//註冊
router.post('/registerMyToDoList', user.register);

//換頁
router.put(
  '/MyToDoListSwitchPage',
  canUserFunctionMiddleware,
  toDoListPage.switchPage
);

/ 清單功能 /;
//新增清單
router.post(
  '/createMyToDoList',
  canUserFunctionMiddleware,
  toDoList.createToDoList
);

//更新清單
router.put(
  '/updateMyToDoList',
  canUserFunctionMiddleware,
  toDoList.updatedToDoList
);

//刪除清單
router.delete(
  '/removeToDoList',
  canUserFunctionMiddleware,
  toDoList.deleteToDoList
);

//新增清單tag
router.post(
  '/createMyToDoTag',
  canUserFunctionMiddleware,
  toDoTag.createToDoTag
);

//清單tag篩選

/ 項目功能 /;
//新增項目
router.post(
  '/createMyToDoItems',
  canUserFunctionMiddleware,
  toDoitems.createToDoItems
);

//更新項目內容
router.put(
  '/updateMyToDoItems',
  canUserFunctionMiddleware,
  toDoitems.updateToDoItems
);

//更新項目進度
router.put(
  '/updateMyToDoItemsSchedule',
  canUserFunctionMiddleware,
  toDoitems.updatedItemsSchedule
);

//刪除項目
router.delete(
  '/removeMyToDoItems',
  canUserFunctionMiddleware,
  toDoitems.deleteToDoItems
);

//項目次序異動
router.put(
  '/MyToDoItemsOrderMove',
  canUserFunctionMiddleware,
  toDoitems.changeItemSort
);

module.exports = router;
