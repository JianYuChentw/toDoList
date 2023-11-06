const express = require('express');
const router = express.Router();
const toDoList = require('../controller/listCtrl');
const toDoitems = require('../controller/itemsCtrl');
const user = require('../controller/userCtrl');
const toDoTag = require('../controller/tagCtrl');
const tools = require('../tool');

//中介層驗證身份
function canUserFunctionMiddleware(req, res, next) {
  // const token = req.session.token;
  const token = req.headers.authorization.replace('Bearer ', '');
  const user = tools.verifyToken(token);
  if (user === null) {
    return res.json({ loginStatus: false, message: '非登入狀態' });
  }
  req.user = user.userId;
  next();
}

//個人to-do list(清單頁-指定前往第幾頁)
router.post('/MyToDoList', canUserFunctionMiddleware, toDoList.readToDoList);

//個人to-do items(項目頁)
router.get(
  '/MyToDoListShow',
  canUserFunctionMiddleware,
  toDoitems.readToDoItems
);

/ 頁面功能 /;
//登入 pass
router.post('/LoginMyToDoList', user.login);

//登出
router.get('/LogOutMyToDoList', user.logOut);

//註冊
router.post('/registerMyToDoList', user.register);

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

/ 標籤功能 /;
//自己的所有標籤
router.get('/getMyToDoTag', canUserFunctionMiddleware, toDoTag.getMyTiDoTag);

//新增tag
router.post(
  '/createMyToDoTag',
  canUserFunctionMiddleware,
  toDoTag.creatToDoTag
);

//刪除tag
router.delete(
  '/deleteMyToDoTag',
  canUserFunctionMiddleware,
  toDoTag.deleteToDoTag
);
//讀取指定標籤相關清單
router.post(
  '/readMyToDoTagList',
  canUserFunctionMiddleware,
  toDoTag.readToDoTag
);
module.exports = router;
