const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost/db_demo')
.then(() => {
    console.log('MongoDB connectd!');
})
.catch((err) => {
    console.log(`MongoDB connect error! ---> ${err}`);
});

