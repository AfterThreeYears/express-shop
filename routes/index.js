var express = require('express');
var router = express.Router();
var Mock = require('../models/mocks');
const {mockLog} = require('../util/logs');
const {Authentication} = require('../auth/auth.service');

router.post('/saveOrupdate', Authentication(), (req, res, next) => {
  const {id, path, jsonStr} = req.body;
  if (!path) return res.json({
    errorCode: null,
    errorMSG: '没有path',
    success: false,
    data: null,
  });
  if (!jsonStr) return res.json({
    errorCode: null,
    errorMSG: '没有jsonStr',
    success: false,
    data: null,
  });  

  let json;
  try {
    json = JSON.parse(jsonStr);
  } catch (error) {
    return res.json({
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
        data: doc._id,
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

router.get('/list', Authentication(), (req, res) => {
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

router.get('/detail', Authentication(), (req, res) => {
  const {id} = req.query;
  Mock
  .findOne({'_id': id})
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
        errorMSG: '没有这个接口',
        success: false,
        data: null,
      });
    }
  })
  .catch((err) => {
    mockLog.debug(`查找接口出错, ${err}`);
  });
});

router.post('/delete', Authentication(), (req, res, next) => {
  const {id} = req.body;
  const authorization = req.get('authorization').replace(/^Bearer\s/, '');
  if (id) {
    Mock.findByIdAndRemove({'_id': id})
    .then((doc) => {
      if (doc) {
        mockLog.info(`${new Date}  用户: ${authorization} 删除了 ${doc.path}接口`);        
        res.json({
          errorCode: null,
          errorMSG: '删除成功',
          success: true,
          data: true,
        });
      } else {
        res.json({
          errorCode: null,
          errorMSG: `该接口已经删除--${doc}`,
          success: false,
          data: null,
        });
      }
    })
    .catch((error) => {
      res.json({
        errorCode: null,
        errorMSG: `出错 -- ${error.message}`,
        success: false,
        data: null,
      });
    });
  } else {
    res.json({
      errorCode: null,
      errorMSG: '没有id',
      success: false,
      data: null,
    });
  }
});

module.exports = router;
