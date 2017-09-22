var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/users');
mongoose.Promise = global.Promise;

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// http://localhost:3000/users/login userName: 鬼剑士, userPwd: 665533
router.post('/login', (req, res, next) => {
  const {userName, userPwd} = req.body;
  const params = {
    userName,
    userPwd,
  };
  User.findOne(params).then((doc) => {
    if (doc) {
      res.cookie('userId', doc.userId, {
        path: '/',
        maxAge: 1000 * 60 * 60,
      });
      res.json({
        status: 0,
        msg: '',
        data: doc.userName,
      });
    } else {
      throw new Error('密码或者用户名错误');
    }
  }).catch((err) => {
    res.json({
      status: 1,
      msg: err.message,
      data: null,
    });
  });
});

// http://localhost:3000/users/logout
router.post('/logout', (req, res, next) => {
  res.cookie('userId', '', {
    path: '/',
    maxAge: -1,
  });
  res.json({
    status: 0,
    msg: '',
    data: '登出成功',
  });
});

// http://localhost:3000/users/checkLogin
router.get('/checkLogin', (req, res) => {
  User.findOne({userId: req.cookies.userId})
  .then((doc) => {
    if (doc) {
      res.json({
        status: 0,
        msg: '',
        data: doc.userName,
      });
    } else {
      throw new Error('登录过期，请重新登录');
    }
  }).catch((err) => {
    res.json({
      status: 1,
      msg: err.message,
      data: null,
    });
  });
});


module.exports = router;
