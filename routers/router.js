const express = require('express');
const router = express.Router();
const toDoListPage = require('../controller/pageCtrl');
const toDoList = require('../controller/listCtrl');
const toDoitems = require('../controller/itemsCtrl');
const user = require('../controller/userCtrl');

/ 頁面 /;
//登入頁 pass
router.get('/LoginMyToDoListPage', toDoListPage.toDolistFrontPage);

//註冊頁
router.get('/registerMyToDoListPage');

//個人to-do list
router.get('/MyToDoList', toDoListPage.MyToDoListPage);

//個人to-do items(清單頁內)
router.get('/MyToDoItems', toDoitems.readToDoItems);

/ 頁面功能 /;
//登入 pass
router.post('/LoginMyToDoList', user.login);

//登出
router.get('/LogOutMyToDoList', user.logOut);

//註冊
router.post('/registerMyToDoList', user.register);

//換頁
router.put('/MyToDoListBeforePage', (req, res) => {
  res.send('分頁查詢 {-}');
});

/ 清單功能 /;
//新增清單
router.post('/createMyToDoList', toDoList.createToDoList);

//更新清單
router.put('/updateMyToDoList', toDoList.updatedToDoList);

//刪除清單
router.delete('/removeToDoList', toDoList.deleteToDoList);

//清單tag
//清單tag篩選

/ 項目功能 /;
//新增項目
router.post('/createMyToDoItems', toDoitems.createToDoItems);

//更新項目內容
router.put('/updateMyToDoItems', toDoitems.updateToDoItems);

//更新項目進度
router.put('/updateMyToDoItemsSchedule', toDoitems.updatedItemsSchedule);

//刪除項目
router.delete('/removeMyToDoItems', toDoitems.deleteToDoItems);

//項目次序異動
router.put('/MyToDoItemsOrderMove', toDoitems.changeItemSort);

module.exports = router;
