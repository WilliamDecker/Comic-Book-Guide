const express = require('express');
const routes = require('./routes/index');
const comics = require('./comics');
const bodyParser = require('body-parser');
const app = express();

app.use('/', routes);
app.use(express.static('../public'));

app.listen(process.env.port || 3000);
console.log('Running at Port 3000');