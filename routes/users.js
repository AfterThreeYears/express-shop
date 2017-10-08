const express = require('express');
const router = express.Router();
const path = require('path');
const User = require('../models/users');
const {Authentication} = require('../auth/auth.service');
const checkVerifyCode = require('../middlewares/checkVerifyCode');
const {
  index,
  registered,
  login,
  getVerifyCode,
  addressList,
  logout,
  checkLogin,
  cartList,
  cartDel,
  cartEdit,
  addAddress,
  delAddress,
} = require(path.join(__dirname, '../controllers/users'));

router.get('/', index);

// http://localhost:3000/users/registered userName: 巫妖王, userPwd: king
router.post('/registered', registered),

// http://localhost:3000/users/login userName: 鬼剑士, userPwd: 665533 // checkVerifyCode
router.post('/login', login);
  
router.get('/getVerifyCode', getVerifyCode);
// http://localhost:3000/users/logout
router.post('/logout',logout);

// http://localhost:3000/users/checkLogin
router.get('/checkLogin', Authentication(), checkLogin);

// http://localhost:3000/users/cartList
router.get('/cartList', Authentication(), cartList);

// http://localhost:3000/users/cart/del {productId: 100003}
router.post('/cart/del', Authentication(), cartDel);

//  http://localhost:3000/users/cart/edit {productId: 100003, productNum: 6666, checked: 0}

router.post('/cart/edit', Authentication(), cartEdit);

// http://localhost:3000/users/addressList
router.get('/addressList', Authentication(), addressList);

// http://localhost:3000/users/add/address 
// {contactPerson: 'name', contactNumber: 'number', contactAddress: 'address', contactId: '59c4d5de9dd6940fe71771d7' isDefault: 1}
router.post('/add/address', Authentication(), addAddress);

//  http://localhost:3000/users/del/address
// {addressId: '59c4d77b7d2ad3117fb19988'}
router.post('/del/address', Authentication(), delAddress);

module.exports = router;
