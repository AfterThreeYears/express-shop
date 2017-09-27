const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const {mongodbUri} = require('../config');

mongoose.connect(mongodbUri)
.then(() => {
    console.log('MongoDB connectd!');
})
.catch((err) => {
    console.log(`MongoDB connect error! ---> ${err}`);
});

