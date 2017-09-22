const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
mongoose.promise = global.promise;
const Goods = require('../models/goods');
const User = require('../models/users');

mongoose.connect('mongodb://localhost/db_demo');

mongoose.connection.on('connectd', () => {
    console.log('connectd');
});

mongoose.connection.on('error', () => {
    console.log('error');
});

mongoose.connection.on('disconnectd', () => {
    console.log('disconnectd');
});

// http://localhost:3000/goods?pageIndex=1&pageSize=10&sort=1&priceGt=0&priceLte=100000
router.get('/', (req, res, next) => {
    const {sort, pageIndex, pageSize, priceGt, priceLte} = req.query;
    console.log(req.query);
    const skip =  (pageIndex - 1) * pageSize;
    const param = {
        salePrice: {
            $gt: priceGt,
            $lte: priceLte,
        },
    };
    const goodsModel = Goods.find(param).skip(skip).limit(+pageSize);
    goodsModel.sort({'salePrice': sort});
    goodsModel.exec({}, (err, doc) => {
        if (err) {
            res.json({
                status: 1,
                msg: err.message,
                data: null,
            });
        } else {
            res.json({
                status: 0,
                msg: '',
                data: {
                    count: doc.length,
                    list: doc,
                },
            });
        }
    });
});

//  http://localhost:3000/goods/addCart userId: 100005, productId: 100003
router.post('/addCart', (req, res, next) => {
    const {productId} = req.body;
    const {userId} = req.cookies;
    const arr = [User.findOne({userId}), Goods.findOne({productId})];
    Promise
    .all(arr)
    .then(([userDoc, goodsDoc]) => {
        if (!userDoc) {
            throw new Error('没用户');
        }
        if (!goodsDoc) {
            throw new Error('没商品');
        }
        let index;
        const checkedGoods = userDoc.cartList.filter((item, idx) => {
            index = idx;
            return +item.productId === +productId;
        })[0];

        if (checkedGoods) {
            checkedGoods.productNum++;
            userDoc.cartList.splice(index, 1, checkedGoods);
        } else {
            goodsDoc.productNum = '1';
            goodsDoc.checked = '1';
            userDoc.cartList.push(goodsDoc);
        }
        return userDoc.save();
    })
    .then((doc) => {
        console.log(doc);
        res.json({
            status: 0,
            msg: '',
            data: doc,
        });
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