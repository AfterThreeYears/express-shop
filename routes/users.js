var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/users');
mongoose.Promise = global.Promise;

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

// http://localhost:3000/users/cartList
router.get('/cartList', (req, res) => {
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
});

// http://localhost:3000/users/cart/del {productId: 100003}
router.post('/cart/del', (req, res) => {
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
});

//  http://localhost:3000/users/cart/edit {productId: 100003, productNum: 6666, checked: 0}

router.post('/cart/edit', (req, res) => {
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
});

// http://localhost:3000/users/addressList
router.get('/addressList', (req, res, next) => {
  const {userId} = req.cookies;
  User.findOne({userId})
  .then((doc) => {
    if (doc) {
      res.json({
        status: 0,
        msg: '',
        data: doc.addressList,
      })
    } else {
      throw new Error('没有该用户');
    }
  }).catch((err) => {
    res.json({
      status: 1,
      msg: err.message,
      data: null,
    });
  })
});

// http://localhost:3000/users/add/address 
// {contactPerson: 'name', contactNumber: 'number', contactAddress: 'address', contactId: '59c4d5de9dd6940fe71771d7' isDefault: 1}
router.post('/add/address', (req, res) => {
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
          console.log(item._id , contactId);
          if (`${item._id}` === `${contactId}`) {
            idx = index;
            curItem = item;
          }
        });
        if (!curItem) {
          throw new Error('没有这个地址!');
        }
        curItem.contactPerson = contactPerson;
        curItem.contactNumber = contactNumber;
        curItem.contactAddress = contactAddress;
        curItem.isDefault = isDefault;

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
});

module.exports = router;
