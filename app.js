const express = require('express');
const app = express();
const cors = require('cors'); // 引入cors
const session = require('express-session'); // 引入express-session
const routes = require('./routers/router');
const port = 3000;

// cors允許所有
app.use(cors());

app.use(
  session({
    secret: 'toDoLost', // key for session
    resave: false, // 每次req重新保存session
    saveUninitialized: true, // 保存初始化的session
  })
);

app.use(express.json({ limit: '1mb' }));

app.use('/', routes);

app.listen(port, () => {
  console.log(
    `Server is running at http://localhost:${port}/LoginMyToDoListPage`
  );
});
