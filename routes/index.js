var express = require('express');
var router = express.Router();
var Mock = require('../models/mocks');
const {mockLog} = require('../util/logs');

router.post('/saveOrupdate', (req, res, next) => {
  const {id, path, jsonStr} = req.body;
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
  if (id) {
    Mock
    .update({"_id": id}, {path, jsonStr})
    .then((doc) => {
      mockLog.debug(`更新完成的结果, ${doc}`);
      res.json({
        errorCode: null,
        errorMSG: '更新成功',
        success: true,
        data: true,
      });
    })
    .catch((err) => {
      mockLog.debug(`更新出错, ${err}`);
      res.json({
        errorCode: null,
        errorMSG: err.message,
        success: false,
        data: null,
      });
    });
  } else {
    const mock = new Mock({
      path: `${path}`,
      jsonStr,
    });
    mock
    .save()
    .then((doc) => {
      res.json({
        errorCode: null,
        errorMSG: '保存成功',
        success: true,
        data: true,
      });
    })
    .catch((err) => {
      mockLog.debug(`保存出错, ${err}`);
      res.json({
        errorCode: null,
        errorMSG: err.message,
        success: false,
        data: null,
      });
    }); 
  }
});

router.get('/list', (req, res) => {
  Mock
  .find({})
  .then((doc) => {
    if (doc) {
      res.json({
        errorCode: null,
        errorMSG: '',
        success: true,
        data: doc,
      });
    } else {
      res.json({
        errorCode: null,
        errorMSG: '没有接口列表',
        success: false,
        data: null,
      });
    }
  })
  .catch((err) => {
    mockLog.debug(`获取接口列表出错, ${err}`);
  });
});

module.exports = router;
