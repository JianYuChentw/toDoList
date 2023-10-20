const express = require('express');
const router = express.Router();
const toDoListPage = require('../controller/pageCtrl');
const toDoList = require('../controller/listCtrl');

/ 頁面 /;
//登入頁
router.get('/LoginMyToDoListPage', toDoListPage.toDolistFrontPage);

//個人to-do list
router.get('/MyToDoList', toDoList.createToDoListtoDolist);

//個人to-do items
router.get('/MyToDoItems', (req, res) => {
  res.send('個人to-do items');
});

/ 頁面功能 /;
//上一頁 {-}
router.put('/MyToDoListBeforePage', (req, res) => {
  res.send('分頁查詢 {-}');
});

//下一頁 {＋}
router.put('/MyToDoListNextPage', (req, res) => {
  res.send('分頁查詢 {＋}');
});

/ 清單功能 /;
//新增清單
router.post('/createMyToDoList', (req, res) => {
  res.send('新增清單');
});

//更新清單
router.put('/updateMyToDoList', (req, res) => {
  res.send('更新清單');
});

//刪除清單
router.put('/removeToDoList', (req, res) => {
  res.send('刪除清單');
});

//清單tag
//清單tag篩選

/ 項目功能 /;
//新增項目
router.post('/createMyToDoItems', (req, res) => {
  res.send('Welcome');
});

//更新項目
router.put('/updateMyToDoItems', (req, res) => {
  res.send('更新項目');
});

//刪除項目
router.put('/removeMyToDoItems', (req, res) => {
  res.send('刪除項目');
});

// 項目次序異動
router.put('/MyToDoItemsOrderMove', (req, res) => {
  res.send('項目次序異動');
});

module.exports = router;
