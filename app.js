const express = require('express');
const path = require('path');
const errorHandler = require('errorHandler');
const isProd = process.env.NODE_ENV === 'production';
require('./db/mongodb');
require(path.join(__dirname, './util/passport'))();

const app = express();
const {appLog} = require('./util/logs');
appLog.debug('express init');
require('./middlewares')(app);
require('./routes')(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

if (isProd) {
  app.use(function (err, req, res, next) {
	  return res.status(500).send();
	});
} else {
  app.use(errorHandler());
}

module.exports = app;
