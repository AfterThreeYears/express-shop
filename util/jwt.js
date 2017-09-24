var jwt = require('jsonwebtoken');
const path = require('path');
const {secret} = require(path.join(__dirname, '../config'));

const createToken = (name) => {
    return jwt.sign({name}, secret, {
        expiresIn: '1h',
    });
};

module.exports = {
    createToken,
};