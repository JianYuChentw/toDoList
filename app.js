const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const routes = require('./routers/router');
const port = 3000;

app.use(bodyParser.json({ limit: '1mb' })); // 改變 '10mb' 成你需要的大小

app.use('/', routes);

app.listen(port, () => {
  console.log(`http://localhost:${port}/LoginMyToDoListPage`);
});
