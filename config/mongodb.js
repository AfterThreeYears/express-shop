const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

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