const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const path = require('path');
const {SALT_WORK_FACTOR} = require(path.join(__dirname, '../config'));
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    userName: {
        type: String,
        required: true,
        index: {
            unique: true,
        },
    },
    userPwd: {
        type: String,
        required: true,
    },  
    token: {
        type: String,
    },
    orderList: Array,
    cartList: [
        {
            productId: String,
            productName : String,
            salePrice : String,
            productImage : String,
            checked: String,
            productNum: String,
        }
    ],
    addressList: [
        {
            contactPerson: String,
            contactNumber: String,
            contactAddress: String,
            contactId: String,
            isDefault: Number,
        }
    ],
});

// 密码加盐 所以更新密码的时候要去调用save，不能使用update
UserSchema.pre('save', function(next) {
    const user = this;
     console.log('user.isModified', user.isModified('userPwd')); 
    if (!user.isModified('userPwd')) return next();

    // 加盐
    bcrypt.genSalt(SALT_WORK_FACTOR)
    .then((salt) => {
        return bcrypt.hash(user.userPwd, salt);
    })
    .then((hash) => {
        user.userPwd = hash;
        next();
    })
    .catch((err) => {
        return next(err);
    });
});

UserSchema.methods.comparePassword = function(candidatePassword) { 
    return bcrypt.compare(candidatePassword, this.userPwd);
};


module.exports = mongoose.model('User', UserSchema, 'users');