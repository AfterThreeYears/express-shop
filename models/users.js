const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    userId: String,
    userName: String,
    userPwd: String,
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

module.exports = mongoose.model('User', UserSchema, 'users');