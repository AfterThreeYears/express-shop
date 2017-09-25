const jwt = require('jsonwebtoken');
const path = require('path');
const {createToken} = require(path.join(__dirname, '../util/jwt'));
const {secret, expiresIn, access_token_name} = require(path.join(__dirname, '../config'));
const Goods = require(path.join(__dirname, '../models/goods'));
const User = require(path.join(__dirname, '../models/users'));

const index = (req, res, next) => {
    const {sort, pageIndex, pageSize, priceGt, priceLte} = req.query;
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
};

const addCart = (req, res, next) => {
    const {productId} = req.body;
    const {access_token} = req.cookies;
    const arr = [User.findOne({token: access_token}), Goods.findOne({productId})];
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
};
module.exports = {
    index,
    addCart,
}