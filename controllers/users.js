const jwt = require('jsonwebtoken');
const path = require('path');
const User = require(path.join(__dirname, '../models/users'));
const {createToken} = require(path.join(__dirname, '../util/jwt'));
const {secret, expiresIn, access_token_name, cookieMaxAge} = require(path.join(__dirname, '../config'));
const ccap = require('ccap');

const registered = (req, res, next) => {
    const {userName, userPwd, key} = req.body;
    if (!userName || !userPwd) {
        return res.json({
            status: 1,
            msg: '请输入账号或者密码',
            data: null,
        });
    }
    if (key !== 'nodejs') {
      return res.json({
          status: 1,
          msg: 'key是必须的',
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
          maxAge: cookieMaxAge,
          httpOnly: false,
        });
        res.json({
          status: 0,
          msg: '',
          data: doc.token,
        });
    })
    .catch((err) => {
      // 每一次失败以后都必须要去重新请求验证码
      req.session.verifyCode = '';
      res.json({
        status: 1,
        msg: err.message,
        data: null,
      });
    });
};

const getVerifyCode = (req, res) => {
  const captcha = ccap();
  const ary = captcha.get();
  const text = ary[0];
  req.session.verifyCode = text;
  const buffer = ary[1];
  res.end(buffer);
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

const index = function(req, res, next) {
    res.json({
      msg: 'hello',
    });
};

const logout = (req, res, next) => {
    res.cookie(access_token_name, '', {
        path: '/',
        maxAge: -1,
    });
    res.json({
        status: 0,
        msg: '',
        data: '登出成功',
    });
};

const checkLogin = (req, res) => {
    const {access_token} = req.cookies;
    User.findOne({token: access_token})
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
};

const cartList = (req, res) => {
    const {access_token} = req.cookies;
    User.findOne({token: access_token})
    .then((doc) => {
      if (doc) {
        res.json({
          status: 0,
          msg: '',
          data: doc.cartList,
        })
      } else {
        throw new Error('没有该用户');
      }
    })
    .catch((err) => {
      res.json({
        status: 1,
        msg: err.message,
        data: null,
      });
    });
};

const cartDel = (req, res) => {
    const {productId} = req.body;
    const {access_token} = req.cookies;
    User.update({token: access_token}, {
      $pull: {
        cartList: {
          productId,
        },
      },
    })
    .then((doc) => {
      if (doc) {
        res.json({
          status: 0,
          msg: '',
          data: doc,
        });
      } else {
        throw new Error('没有该用户');
      }
    })
    .catch((err) => {
      res.json({
        status: 1,
        msg: err.message,
        data: null,
      });
    });
};

const cartEdit = (req, res) => {
    const {productNum, productId, checked} = req.body;
    const {access_token} = req.cookies;
    User.update({
      token: access_token,
      'cartList.productId': productId,
    }, {
      'cartList.$.productNum': productNum,
      'cartList.$.checked': checked,
    })
    .then((doc) => {
      if (doc) {
        res.json({
          status: 0,
          msg: '',
          data: doc,
        });
      } else {
        throw new Error('没有该用户');
      }
    })
    .catch((err) => {
      res.json({
        status: 1,
        msg: err.message,
        data: null,
      });
    });
};

const addAddress = (req, res) => {
    const {
      contactPerson,
      contactNumber,
      contactAddress,
      contactId,
      isDefault,
    } = req.body;
    const {access_token} = req.cookies;
    User.findOne({token: access_token})
    .then((doc) => {
      if (!contactPerson) throw new Error('没有收件人');
      if (!contactNumber) throw new Error('没有电话');
      if (!contactAddress) throw new Error('没有地址');
      if (doc) {
        if (contactId) {
          const index = doc.addressList.findIndex((item) => `${item._id}` === `${contactId}`);
          if (index === -1) {
            throw new Error('没有这个地址!');
          }
          doc.addressList[index] = Object.assign(doc.addressList[index], {
            contactPerson,
            contactNumber,
            contactAddress,
            isDefault: isDefault || 0,
          });
        } else {
          doc.addressList.push({
            contactPerson,
            contactNumber,
            contactAddress,
            isDefault: isDefault || 0,
          });
        }
        return doc.save();
      } else {
        throw new Error('没有用户');
      }
    })
    .then((doc) => {
      res.json({
        status: 0,
        msg: '',
        data: doc.addressList.shift(),
      })
    })
    .catch((err) => {
      res.json({
        status: 1,
        msg: err.message,
        data: null,
      });
    });
};

const delAddress = (req, res) => {
    const {access_token} = req.cookies;
    const {contactId} = req.body;
    User.update({token: access_token}, {
      $pull: {
        addressList: {
          _id: contactId,
        },
      },
    })
    .then((doc) => {
      if (doc && doc.nModified) {
        res.json({
          status: 0,
          msg: '',
          data: 'suc',
        });
      } else {
        throw new Error('没有这个地址');
      }
    }).catch((err) => {
      res.json({
        status: 1,
        msg: err.message,
        data: null,
      });
    });
};

module.exports = {
    registered,
    login,
    getVerifyCode,
    addressList,
    index,
    logout,
    checkLogin,
    cartList,
    cartDel,
    cartEdit,
    addAddress,
    delAddress,
};