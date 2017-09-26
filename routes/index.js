var express = require('express');
var router = express.Router();
var Mock = require('../models/mocks');
const {mockLog} = require('../util/logs');
var httpProxy = require('http-proxy');

router.post('/save', (req, res, next) => {
  const {path, jsonStr} = req.body;
  let json;
  try {
    json = JSON.parse(jsonStr);
  } catch (error) {
    res.json({
      errorCode: null,
      errorMSG: 'json解析错误',
      success: false,
      data: null,
    });
  }
  const mock = new Mock({
    path: `/proxy/${path}`,
    jsonStr,
  });
  mock.save()
    .then((doc) => {
      res.json({
        errorCode: null,
        errorMSG: '保存成功',
        success: true,
        data: true,
      });
    })
    .catch((error) => {
      res.json({
        errorCode: null,
        errorMSG: err.message,
        success: false,
        data: null,
      });
    });
});

router.all('/**', function(req, res, next) {
  
  mockLog.debug(req.cookies);
  mockLog.info(`req.originalUrl是 ${req.originalUrl}`);
  Mock.findOne({path: req.originalUrl})
  .then((doc) => {
    if (doc) {
      res.json(JSON.parse(doc.jsonStr));
    } else {
      res.json({
        errorCode: null,
        errorMSG: '没有数据',
        success: false,
        data: null,
      });
    }
  })
  .catch((err) => {
    res.json({
      errorCode: null,
      errorMSG: err.message,
      success: false,
      data: null,
    });
  });
});

module.exports = router;
