const jwt = require('jsonwebtoken');
const path = require('path');
const {secret, expiresIn, access_token_name, cookieMaxAge} = require(path.join(__dirname, '../config'));
const {appLog} = require('../util/logs');
const User = require(path.join(__dirname, '../models/users'));

const createToken = (name) => {
    return jwt.sign({name}, secret, {
        expiresIn,
    });
};

const checkToken = (req, res, next) => {
    const {access_token} = req.cookies;
    if (!access_token) {
        return res.json({
            status: 1,
            msg: `请登录`,
            data: null,
        });
    }
    try {
        jwt.verify(access_token, secret, {expiresIn}, (err, decode) => {
            if (err) {
                return res.json({
                    status: 1,
                    msg: 'token反正过期了',
                    data: null,
                });
            }
            // 小于3分钟那么去刷新token, 当次请求还是使用原来的那个token进行数据库查询，
            // 下个请求就是使用新的数据库查询了
            if ((decode.exp * 1000) - Date.now() < 1000 * 60 * 3) {
                User.findOne({userName: decode.name})
                .then((doc) => {
                    if (doc) {
                        const token = createToken(decode.name);
                        doc.token = token;
                        return doc.save();
                    }
                })
                .then((doc) => {
                    res.cookie(access_token_name, doc.token, {
                        maxAge: cookieMaxAge,
                        httpOnly: false,
                    }); 
                })
                .catch((err) => {
                    appLog.error('jwt: ', err);
                });
            }
            next();            
        });
    } catch (error) {
        res.json({
            status: 1,
            msg: error.message,
            data: null,
        });
    }
};

module.exports = {
    createToken,
    checkToken,
};