const express = require('express');
const app = express();

const routes = require('./routers/router');
const port = 3000;

console.log(new Date());
app.use('/', routes);
app.listen(port, () => {
  console.log(`http://localhost:${port}/loginMyToDoList`);
});
