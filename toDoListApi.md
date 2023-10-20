# **My To Do List**
 >My To Do List API說明
# **登入頁**

>訪問登入頁

- **URL**
  /LoginMyToDoListPage

- **Method:**

  `GET`

- **URL Params**

  `none`

-  **Required:**

   `none`

- **Success Response:**
    >loginStatus，true為已登入,false為無登入
  - **Code:** 200 <br />
    **Content:**
    `HTML 內容（登入頁面）`
    ```json
    {
     "loginStatus":false, //Boolean 
    }
    ```

# **個人首頁**

>訪問登入頁

- **URL**
  /MyToDoList

- **Method:**

  `GET`

- **URL Params**

  `none`

-  **Required:**

   `none`

- **Success Response:**
  - **Code:** 200 
    **Content:**
    `HTML 內容（待辦清單頁面，可瀏覽清單及項目，不允許編輯項目）`
    ```json
    {
        "toDoList":[{
            "listId":1, // Int
            "listTitle":"待辦清單1", //Str
            "listCreatTime":"2023-10-16", //datetime
            "listLastUpDateTime":"2023-10-16", //datetime
            "itemsFinsh":5, //Int
            "itemsUndo":5, //Int
            "itemsTotal":10, //Int
            "toDoitems":[{
                "itemsTitle":"待辦項目1"},{ //Str
                "itemsTitle":"待辦項目2"} //Str
                ],  //Array
            },{
            "listTitle":"待辦清單2", //Str
            "listCreatTime":"2023-10-16", //datetime
            "listLastUpDateTime":"2023-10-16", //datetime
            "itemsFinsh":5, //Int
            "itemsUndo":5, //Int
            "itemsTotal":10, //Int
            "toDoitems":[{
                "itemsTitle":"待辦項目1"},{ //Str
                "itemsTitle":"待辦項目2"} //Str
                ], //Array
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
        "loginStatus": false //Boolean
      }
    ```


# **單一清單頁**

>指定清單瀏覽

- **URL**
  /MyToDoList/:listTitle

- **Method:**

  `GET`

- **URL Params**

  `listTitle`

-  **Required:**

   `none`

- **Success Response:**
    >ItemsSchedule，true為已完成,false為未完成
  - **Code:** 200 <br />
    **Content:**
    `HTML 內容（指定清單頁面，顯示項目詳細內容）`
    ```json
    {
        "toDoitems":[{
            "itemsId":1, //Num
            "itemsTitle":"待辦項目1", //Str
            "ItemsSchedule":true, //Boolean
            "ItemsCreatTime":"2023-10-16", //DateTime
            "ItemsLastUpDateTime":"2023-10-16", //DateTime
            },{
            "itemsId":2, //Num
            "itemsTitle":"待辦項目2", //Str
            "ItemsSchedule":true, //Boolean
            "ItemsCreatTime":"2023-10-16", //DateTime
            "ItemsLastUpDateTime":"2023-10-16", //DateTime
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
        "loginStatus": false //Boolean
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
      "account": "NianYaoBro", //Str
      "password": "password123" //Str
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
      "loginStatus":true //Boolean
      }
    ```

- **Error Response:**
  >登入失敗
  - **Code:** 401 <br />
    **Content:**
    `(登入失敗)`
    ```json
      {
      "loginStatus":false //Boolean
      }
    ```
- **Error Response:**

  >未登入狀態

  - **Code:** 401 <br />
    **Content:** 
    ```json
      {
        "loginStatus": false //Boolean
      }
    ```

## **上一頁**
>前往上一頁

- **URL**
/MyToDoListBeforePage

- **Method:**

  `PUT`

- **URL Params**

  `none`

-  **Required:**

- **Success Response:**

  - **Code:** 200 <br />
    **Content:**

    `(返回下一頁資料)`
    ```json
    {
        "toDoList":[{
            "listTitle":"待辦清單1", //Str
            "listCreatTime":"2023-10-16", //DateTime
            "listLastUpDateTime":"2023-10-16", //DateTime
            "itemsFinsh":5, //Int
            "itemsUndo":5, //Int
            "itemsTotal":10, //Int
            "toDoitems":[{
                "itemsTitle":"待辦項目1"},{ //Str
                "itemsTitle":"待辦項目2"} //Str
                ],  //Array
            },{
            "listtitle":"待辦清單2", //Str
            "listCreatTime":"2023-10-16", //DateTime
            "listLastUpDateTime":"2023-10-16", //DateTime
            "itemsFinsh":5, //Int
            "itemsUndo":5, //Int
            "itemsTotal":10, //Int
            "toDoitems":[{
                "itemsTitle":"待辦項目1"},{ //Str
                "itemsTitle":"待辦項目2"} //Str
                ], //Array
            },
        ],  //Array
        "nowPage":1, //Int    
        "totlePage":3, //Int    
    }
    ```

- **Error Response:**

  >未登入狀態

  - **Code:** 401 <br />
    **Content:** 
    ```json
      {
        "loginStatus": false //Boolean
      }
    ```


## **下一頁**
>前往下一頁

- **URL**
/MyToDoListNextPage

- **Method:**

  `PUT`

- **URL Params**

  `none`

-  **Required:**

- **Success Response:**

  - **Code:** 200 <br />
    **Content:**

    `(返回下一頁資料)`
    ```json
    {
        "toDoList":[{
            "listTitle":"待辦清單1", //Str
            "listCreatTime":"2023-10-16", //DateTime
            "listLastUpDateTime":"2023-10-16", //DateTime
            "itemsFinsh":5, //Int
            "itemsUndo":5, //Int
            "itemsTotal":10, //Int
            "toDoitems":[{
                "itemsTitle":"待辦項目1"},{ //Str
                "itemsTitle":"待辦項目2"} //Str
                ],  //Array
            },{
            "listtitle":"待辦清單2", //Str
            "listCreatTime":"2023-10-16", //DateTime
            "listLastUpDateTime":"2023-10-16", //DateTime
            "itemsFinsh":5, //Int
            "itemsUndo":5, //Int
            "itemsTotal":10, //Int
            "toDoitems":[{
                "itemsTitle":"待辦項目1"},{ //Str
                "itemsTitle":"待辦項目2"} //Str
                ], //Array
            },
        ],  //Array
        "nowPage":2, //Int    
        "totlePage":3, //Int    
    }
    ```

- **Error Response:**

  >未登入狀態

  - **Code:** 401 <br />
    **Content:** 
    ```json
      {
        "loginStatus": false //Boolean
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
        "itemsTitle":"我是新來的" //Str  
      }
    ```

- **Success Response:**
  >新增成功
  - **Code:** 200 <br />
    **Content:**
    `(返回成功提示)`
    <br />
    ```json
      {
        "createList":true //Boolean
      }
    ```

- **Error Response:**
  >新增失敗
  - **Code:** 401 <br />
    **Content:**
    `返回失敗提示`
    ```json
      {
        "createList":false //Boolean
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
        "itemsTitle":"我不是新來的"  //Str  
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
        "updateList":true  //Boolean
      }
    ```

- **Error Response:**
  >更新失敗
  - **Code:** 401 <br />
    **Content:**
    `返回失敗提示`
    ```json
      {
        "updateList":false //Boolean
      }
    ```


## **刪除待辦清單**

>刪除"清單"

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
        "listId":1, //Num
      }
    ```

- **Success Response:**
  >刪除成功
  - **Code:** 200 <br />
    **Content:**
    `(返回成功提示)`
    <br />
    ```json
      {
        "removeList":true  //Boolean
      }
    ```

- **Error Response:**
  >刪除失敗
  - **Code:** 401 <br />
    **Content:**
    `返回失敗提示`
    ```json
      {
        "removeList":false //Boolean
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
        "itemsTitle":"我是ＸＸＸ" //Str  
      }
    ```

- **Success Response:**
  >新增成功
  - **Code:** 200 <br />
    **Content:**
    `(返回成功提示)`
    <br />
    ```json
      {
        "createItems":true //Boolean
      }
    ```

- **Error Response:**
  >新增失敗
  - **Code:** 401 <br />
    **Content:**
    `返回失敗提示`
    ```json
      {
        "createItems":false //Boolean
      }
    ```

## **更新待辦項目**

>更新"項目"

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
        "itemsTitle":"我不是新來的"  //Str  
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
        "updateItems":true  //Boolean
      }
    ```

- **Error Response:**
  >更新失敗
  - **Code:** 401 <br />
    **Content:**
    `返回失敗提示`
    ```json
      {
        "updateItems":false //Boolean
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
        "itemsId":1, //Num
      }
    ```

- **Success Response:**
  >刪除成功
  - **Code:** 200 <br />
    **Content:**
    `(返回成功提示)`
    <br />
    ```json
      {
        "removeItems":true  //Boolean
      }
    ```

- **Error Response:**
  >刪除失敗
  - **Code:** 401 <br />
    **Content:**
    `返回失敗提示`
    ```json
      {
        "removeItems":false //Boolean
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
        "toDoitems":[{
            "itemsId":2, //Num
            "itemsTitle":"待辦項目2", //Str
            "ItemsSchedule":true, //Boolean
            "ItemsCreatTime":"2023-10-16", //DateTime
            "ItemsLastUpDateTime":"2023-10-16", //DateTime
            },{
            "itemsId":1, //Num
            "itemsTitle":"待辦項目1", //Str
            "ItemsSchedule":true, //Boolean
            "ItemsCreatTime":"2023-10-16", //DateTime
            "ItemsLastUpDateTime":"2023-10-16", //DateTime
            }
        ], //Array
    }
    ```

- **Error Response:**
  >更新失敗
  - **Code:** 400 <br />
    **Content:**
    `返回失敗提示`
    ```json
      {
        "sortOrderUpdate":false //Boolean
      }
    ```

