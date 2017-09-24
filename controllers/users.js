const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
mongoose.Promise = global.Promise;
const path = require('path');
const User = require(path.join(__dirname, '../models/users'));
const {createToken} = require(path.join(__dirname, '../util/jwt'));
const {secret, expiresIn} = require(path.join(__dirname, '../config'));

const registered = (req, res, next) => {
    const {userName, userPwd} = req.body;
    if (!userName || !userPwd) {
        res.json({
            status: 1,
            msg: '请输入账号或者密码',
            data: null,
        });
    }
    const user = new User({
        userName,
        userPwd,
    });
    user.save()
    .then((doc) => {
        res.json({
            status: 0,
            msg: '注册成功',
            data: null,
        });
    })
    .catch((err) => {
        res.json({
            status: 1,
            msg: `注册失败, msg${err.message}`,
            data: null,
        });
    });
};

const login = (req, res, next) => {
    const {userName, userPwd} = req.body;
    let data;
    User.findOne({userName}).then((doc) => {
        if (doc) {
            data = doc;
            return doc.comparePassword(userPwd);
        } else {
            throw new Error('密码或者用户名错误');
        }
    })
    .then((isMatch) => {
        // 密码匹配上以后，创建token存入数据库，并且返回给前端
        if (isMatch) {
            const token = createToken(userName);
            data.token = token;
            return data.save();
        } else {
            throw new Error('密码或者用户名错误');
        }
    })
    .then((doc) => {
        res.cookie('access_token', doc.token, {
          // 一个小时
          maxAge: 1000 * 60 * 60,
          httpOnly: true,
        });
        res.json({
          status: 0,
          msg: '',
          data: doc.token,
        });
    })
    .catch((err) => {
      res.json({
        status: 1,
        msg: err.message,
        data: null,
      });
    });
};

const addressList = (req, res, next) => {
    const msg = req.user.msg;
    if (req.user.msg) {
        res.json({
            status: 1,
            msg,
            data: null,
        });
    } else {
        res.json({
            status: 0,
            msg: '',
            data: req.user.addressList,
        });
    }

};

module.exports = {
    registered,
    login,
    addressList,
};