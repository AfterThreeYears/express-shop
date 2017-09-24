const jwt = require('jsonwebtoken');
const path = require('path');
const User = require(path.join(__dirname, '../models/users'));
const {createToken} = require(path.join(__dirname, '../util/jwt'));
const {secret, expiresIn, access_token_name} = require(path.join(__dirname, '../config'));

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

const index = function(req, res, next) {
    res.send('respond with a resource');
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
};

const cartList = (req, res) => {
    const {userId} = req.cookies;
    User.findOne({userId: `${userId}`})
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
    const {userId} = req.cookies;
    User.update({userId}, {
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
    const {userId} = req.cookies;
    User.update({
      userId,
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
    const {userId} = req.cookies;
    User.findOne({userId})
    .then((doc) => {
      if (doc) {
        if (contactId) {
          let idx, curItem;
          doc.addressList.forEach((item, index) => {
            if (`${item._id}` === `${contactId}`) {
              item.contactPerson = contactPerson;
              item.contactNumber = contactNumber;
              item.contactAddress = contactAddress;
              item.isDefault = isDefault;
              idx = index;            
              curItem = item;            
            }
          });
          if (!curItem) {
            throw new Error('没有这个地址!');
          }        
          doc.addressList[idx] = curItem;
        } else {
          doc.addressList.push({
            contactPerson,
            contactNumber,
            contactAddress,
            isDefault,
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
        data: 'suc',
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
    const {userId} = req.cookies;
    const {addressId} = req.body;
    User.update({userId}, {
      $pull: {
        addressList: {
          _id: addressId,
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