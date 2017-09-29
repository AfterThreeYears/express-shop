var jwt = require('jsonwebtoken');
const path = require('path');
const {secret, expiresIn} = require(path.join(__dirname, '../config'));

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
        jwt.verify(access_token, secret, {
            expiresIn
        });
        next();
    } catch (error) {
        res.json({
            status: 1,
            msg: `token过期了`,
            data: null,
        });
    }
};

module.exports = {
    createToken,
    checkToken,
};