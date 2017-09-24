const express = require('express');
const router = express.Router();
const passport = require('passport');
const path = require('path');
const {
    index,
    addCart,
  } = require(path.join(__dirname, '../controllers/goods'));

// http://localhost:3000/goods?pageIndex=1&pageSize=10&sort=1&priceGt=0&priceLte=100000
router.get('/', index);

//  http://localhost:3000/goods/addCart userId: 100005, productId: 100003
router.post('/addCart', addCart);

module.exports = router;