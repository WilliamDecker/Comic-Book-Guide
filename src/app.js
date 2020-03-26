const express = require('express');
const routes = require('./routes/index');
const bodyParser = require('body-parser'); 
const app = express();
const path = require('path');
const helpers = require('./helpers');
const readFile = require('./controllers/readFile');

app.use(express.static(path.join(__dirname, '../public')));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use((req, res, next) => {
  res.locals.h = helpers;
  res.locals.readFile = readFile;
  next();
});

app.use('/', routes);
counter = 0;

module.exports = app;