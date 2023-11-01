# **My To Do List**
 >My To Do List API說明

# **所有清單頁(含分頁索引)**

>訪問登入頁

- **URL**
  /MyToDoList

- **Method:**

  `GET`

- **URL Params**

  `none`

-  **Required:**

  - **Required:**
      **Body:**

    ```json
      {
        "goalPage": "1", //Numbered
      }
    ```

- **Success Response:**
  - **Code:** 200 
    **Content:**
    `HTML 內容（待辦清單頁面，可瀏覽清單及項目，不允許編輯項目）`
    ```json
    {
      "loginStatus":true, //Boolean
      "toDoList":[{
          "id":1, // Int
          "userId": 1,
          "listTitle":"待辦清單1", //String
          "listCreatTime":"2023/10/24 上午9:02:23", //datetime
          "listLastUpDateTime":"2023/10/24 上午10:04:00", //datetime
          "itemsFinsh":5, //Int
          "itemsUndo":5, //Int
          "itemsTotal":10, //Int
          "toDoitems":[{
              "itemsTitle":"待辦項目1"  ,//String
              "itemsSortOrder": 1},{ //Number
              "itemsTitle":"待辦項目2",//String
              "itemsSortOrder": 2} //Number
              ],  //Array
          },{
          "id":2, // Int
          "userId": 1,
          "listTitle":"待辦清單2", //String
          "listCreatTime":"2023/10/24 上午9:04:54", //datetime
          "listLastUpDateTime":"2023/10/24 上午10:02:48", //datetime
          "itemsFinsh":5, //Int
          "itemsUndo":5, //Int
          "itemsTotal":10, //Int
          "toDoitems":[{
              "itemsTitle":"null" //無項目時
          }], //Array
          },
        ],  //Array
      "nowPage":1, //Int    
      "totlePage":1, //Int    
    }
    
    ```

- **Error Response:**

  >未登入狀態

  - **Code:** 401 <br />
    **Content:** 
    ```json
    {
      "gettoDoList":false, //Boolean
      "message":"伺服器錯誤" //String
    }
    or
    {
        "loginStatus": false, //Boolean
        "message": "非登入狀態" //String
    }
    ```


# **清單項目頁**

>指定清單瀏覽，會展現內含項目

- **URL**
  /MyToDoListShow

- **Method:**

  `GET`

- **URL Params**

  `none`

-  **Required:**

   `none`

- **Success Response:**
    >ItemsSchedule，true為已完成,false為未完成
  - **Code:** 200 <br />
    **Content:**
    `（指定清單頁面，顯示項目詳細內容）`
    ```json
    {   
      "loginStatus":true, //Boolean
      "toDoitems":[{
          "id":1, //Num
          "listId":1, //Num
          "itemsSortOder": 3,//Num
          "itemsTitle":"待辦項目1", //String
          "ItemsSchedule":true, //Boolean
          "ItemsCreatTime":"2023/10/24 上午9:02:23", //DateTime
          "ItemsLastUpDateTime":"2023/10/24 上午10:04:00", //DateTime
          },{
          "id":2, //Num
          "listId":1, //Num
          "itemsSortOder": 4,//Num
          "itemsTitle":"待辦項目2", //String
          "ItemsSchedule":true, //Boolean
          "ItemsCreatTime":"2023-10-26 13:48:34", //DateTime
          "ItemsLastUpDateTime":"2023-10-26 13:48:34", //DateTime
           } 
       ], //Array
    }
    ```
- **Error Response:**

  >未登入狀態

  - **Code:** 401 <br />
    **Content:** 
    ```json
      {
        "loginStatus": false, //Boolean
        "message": "非登入狀態" //String
      }
      or
      {
        "readedItems": false,
        "message": "讀取項目失敗或清單內無內容"
      }
    ```

# **頁面功能**
## **登入**

>輸入帳號、密碼

- **URL**
  >/LoginMyToDoList

 **Method:**

  `POST`
- **URL Params**

  `none`

- **Required:**
      **Body:**

    ```json
      {
      "account": "NianYaoBro", //String
      "password": "password123" //String
      }
    ```

- **Success Response:**
  >登入成功
  - **Code:** 200 <br />
    **Content:**
    `(登入成功，給予權限)`
    <br />
    ```json
      {
      "loginStatus":true, //Boolean
      "message": "登入成功" //String
      }
    ```

- **Error Response:**
  >登入失敗
  - **Code:** 401 <br />
    **Content:**
    `(登入失敗)`
    ```json
      {
      "loginStatus":false, //Boolean
      "message": "登入失敗,帳號或密碼有誤！" //String
      }
    ```

## **註冊**

>輸入帳號、密碼註冊為會員

- **URL**
  >/registerMyToDoList

 **Method:**

  `POST`
- **URL Params**

  `none`

- **Required:**
      **Body:**

    ```json
      {
      "account": "NianYaoBro", //String
      "password": "password123" //String
      }
    ```

- **Success Response:**
  >註冊成功
  - **Code:** 200 <br />
    **Content:**
    `註冊成功)`
    <br />
    ```json
      {
      "registerResult":true, //Boolean
      "message": "註冊成功" //String
      }
    ```

- **Error Response:**
  >註冊失敗
  - **Code:** 401 <br />
    **Content:**
    `(註冊失敗)`
    ```json
      {
      "registerResult":false, //Boolean
      "message": "帳號已存在" //String
      }
    ```

## **登出**

>登出會員

- **URL**
  /logOutMyToDoList

- **Method:**

  `GET`

- **URL Params**

  `none`

-  **Required:**

   `none`

- **Success Response:**
    >登出會員
  - **Code:** 200 <br />
    **Content:**
    `登出成功`
    ```json
    {
     "oginStatus": true, //Boolean
      "message": "登出成功" //String
    }
    ```
- **Error Response:**
  >已經是登出狀態，或憑證過期
  - **Code:** 401 <br />
    **Content:**
    `(已登出狀態)`
    ```json
      {
      "registerResult":false, //Boolean
      "message": "非登入狀態" //String
      }
    ```


# **清單功能**
## **新增待辦清單**

>新增"清單"

  **URL**
  >/createMyToDoList

- **Method:**

  `POST`

- **URL Params**
  
  `none`

- **Required:**
      **Body:**

    ```json
      {
        "itemsTitle":"我是新來的" //String  
      }
    ```

- **Success Response:**
  >新增成功
  - **Code:** 200 <br />
    **Content:**
    `(返回成功提示或失敗提示)`
    <br />
    ```json
      {
        "createList":true, //Boolean
        "message":"新增清單成功" //Stringing
      }
      
    ```

- **Error Response:**
  >發生錯誤
  - **Code:** 500 <br />
    **Content:**
    `返回錯舞提示`
    ```json
      {
        "createList":true, //Boolean
        "message":"伺服器錯誤" //Stringing
      }
      or
      {
        "createList":false, //Boolean
        "message":"新增清單失敗" //Stringing
      }
      or
      {
        "loginStatus": false, //Boolean
        "message": "非登入狀態" //String
      }
    ```

## **更新待辦清單**

>更新"清單"

  **URL**
  >/updateMyToDoList

- **Method:**

  `PUT`

- **URL Params**
  
  `none`

- **Required:**
      **Body:**

    ```json
      { 
        "listId":1, //Num
        "listTitle":"我不是新來的"  //String  
      }
    ```

- **Success Response:**
  >更新成功
  - **Code:** 200 <br />
    **Content:**
    `(返回成功或失敗提示)`
    <br />
    ```json
      {
        "updateList":true,  //Boolean
        "message": "更新清單成功" //String
      }
    ```

- **Error Response:**
  >發生錯誤
  - **Code:** 500 <br />
    **Content:**
    `返回失敗提示`
    ```json
      {
      "updateList":true,  //Boolean
      "message": "伺服器錯誤" //String
      }
      or
      {
        "updateList":true,  //Boolean
        "message": "更新清單失敗" //String
      }
        or
      {
        "loginStatus": false, //Boolean
        "message": "非登入狀態" //String
      }
    ```


## **刪除待辦清單**

>刪除"清單"(含批次刪除)

  **URL**
  >/removeToDoList

- **Method:**

  `PUT`

- **URL Params**
  
  `none`

- **Required:**
      **Body:**

    ```json
      {
        "listId":[
          1 //Num
          ], //Array
      }
    ```

- **Success Response:**
  >刪除成功
  - **Code:** 200 <br />
    **Content:**
    `(返回成功提示或返回失敗提示)`
    <br />
    ```json
      {
        "removeList":true,  //Boolean
        "message": "刪除清單成功"
      }
      
    ```

- **Error Response:**
  >發生錯誤
  - **Code:** 500 <br />
    **Content:**
    `返回錯誤提示`
    ```json
      {
        "removeList":false, //Boolean
        "message": "伺服器錯誤"
      }
      or
      {
        "removeList":true,  //Boolean
        "message": "刪除清單失敗"
      }
      or
      {
        "loginStatus": false, //Boolean
        "message": "非登入狀態" //String
      }
    ```


# **項目功能**
## **新增待辦項目**

>新增"項目"

  **URL**
  >/createMyToDoItems

- **Method:**

  `POST`

- **URL Params**
  
  `none`

- **Required:**
      **Body:**

    ```json
      {
        "items":1, //Number  
        "itemsTitle":"我是ＸＸＸ" //String  
      }
    ```

- **Success Response:**
  >新增成功
  - **Code:** 200 <br />
    **Content:**
    `(返回成功提示或失敗提示)`
    <br />
    ```json
      {
        "createItems":true, //Boolean
        "message":"新增項目成功"
      }
      
    ```

- **Error Response:**
  >新增失敗
  - **Code:** 401 <br />
    **Content:**
    `返回錯誤提示`
    ```json
      {
        "createItems":false, //Boolean
        "message":"伺服器錯誤" //String
      }
      or
      {
        "createItems":false, //Boolean
        "message":"新增項目失敗" //String
      }
      or
      {
        "loginStatus": false, //Boolean
        "message": "非登入狀態" //String
      }
    ```

## **更新待辦項目內容**

>更新"項目"內容

  **URL**
  >/updateMyToDoItems

- **Method:**

  `PUT`

- **URL Params**
  
  `none`

- **Required:**
      **Body:**

    ```json
      { 
        "itemsId":1, //Num
        "itemsTitle":"我不是新來的"  //String  
      }
    ```

- **Success Response:**
  >更新成功
  - **Code:** 200 <br />
    **Content:**
    `(返回成功或失敗提示)`
    <br />
    ```json
      {
        "updateItems":true,  //Boolean
        "message":"更新項目成功" //String
      }
      
    ```

- **Error Response:**
  >更新失敗
  - **Code:** 401 <br />
    **Content:**
    `返回錯誤提示`
    ```json
      {
        "updateItems":false, //Boolean
        "message":"伺服器錯誤" //String
      }
      or
      {
        "updateItems":false, //Boolean
        "message":"更新項目失敗" //String
      }
      or
      {
        "loginStatus": false, //Boolean
        "message": "非登入狀態" //String
      }
    ```


## **刪除待辦項目**

>刪除"項目"

  **URL**
  >/removeMyToDoItems

- **Method:**

  `PUT`

- **URL Params**
  
  `none`

- **Required:**
      **Body:**

    ```json
       {
        "itemsId": 1 //Num
      }
    ```

- **Success Response:**
  >刪除成功
  - **Code:** 200 <br />
    **Content:**
    `(返回成功或失敗提示)`
    <br />
    ```json
      {
        "removeItems":true,  //Boolean
        "message":"刪除項目成功" //String
      }
      
    ```

- **Error Response:**
  >刪除失敗
  - **Code:** 401 <br />
    **Content:**
    `返回失敗提示`
    ```json
      {
        "removeItems":false, //Boolean
        "message":"伺服器錯誤" //String
      }
      or
      {
        "removeItems":false, //Boolean
        "message":"刪除項目失敗" //String
      }
      or
      {
        "loginStatus": false, //Boolean
        "message": "非登入狀態" //String
      }
    ```

## **更新待辦項進度**

>更新"項目"完成狀態

  **URL**
  >/updateMyToDoItemsSchedule

- **Method:**

  `PUT`

- **URL Params**
  
  `none`

- **Required:**
      **Body:**

    ```json
      { 
        "itemsId":1, //Num 
      }
    ```

- **Success Response:**
  >更新成功
  - **Code:** 200 <br />
    **Content:**
    `(返回成功或失敗提示)`
    <br />
    ```json
      {
        "updateItemsSchedule":true,  //Boolean
        "message":"更新項目進度成功" //String
      }
      
    ```

- **Error Response:**
  >更新失敗
  - **Code:** 401 <br />
    **Content:**
    `返回錯誤提示`
    ```json
      {
        "updateItemsSchedule":false, //Boolean
        "message":"伺服器錯誤" //String
      }
      or
      {
        "updateItemsSchedule":false, //Boolean
        "message":"更新項目進度失敗" //String
      }
      or
      {
        "loginStatus": false, //Boolean
        "message": "非登入狀態" //String
      }
    ```



## **項目次序異動**

>"項目"次序異動

  **URL**
  >/MyToDoItemsOrderMove

- **Method:**

  `PUT`

- **URL Params**
  
  `none`

- **Required:**
      **Body:**

    ```json
      { 
        "itemsId":1, //Num
        "sortOrder":2, //Num  
      }
    ```

- **Success Response:**
  >更新成功
  - **Code:** 200 <br />
    **Content:**
    `(返回成功提示)`
    <br />
    ```json
    {   
      "sortOrderUpdate":true, //Boolean
     "message": "更新項目排序成功" //String
    }
    ```

- **Error Response:**
- 
  >更新失敗
  - **Code:** 400 <br />
    **Content:**
    `返回失敗提示`
    ```json
      {
        "gettoDoList":false, //Boolean
        "message":"伺服器錯誤" //String
      }
      or
      {
        "sortOrderUpdate":false, //Boolean
        "message":"更新項目失敗" //String
      }
      or
      {
        "loginStatus": false, //Boolean
        "message": "非登入狀態" //String
      }
    ```

