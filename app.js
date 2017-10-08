const express = require('express');
const path = require('path');
const errorhandler = require('errorhandler');
const isProd = process.env.NODE_ENV === 'production';
require('./db/mongodb');
require(path.join(__dirname, './util/passport'))();

const app = express();
const {appLog} = require('./util/logs');

require('./middlewares')(app);
require('./routes')(app);

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
  app.use(errorhandler());
}

module.exports = app;
