const express = require('express');
const cors = require('cors');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const passport = require('passport');
const compression = require('compression');
const expressSession = require('express-session');
const RedisStore = require('connect-redis')(expressSession);
const ejs = require('ejs');
const {corsConfig} = require('../config');
const proxy = require('./proxy');

// 创建Redis客户端
const redis = require('redis');
const redisClient = redis.createClient(6379, '127.0.0.1');
    
module.exports = (app) => {
    app.use(compression());
    app.use(cors(corsConfig));
    app.use(logger('dev'));
    app.use(expressSession(
        {
            store: new RedisStore({client: redisClient}),
            resave: false,
            secret: 'wbb',
            saveUninitialized: false
        }
    ));
    app.use(bodyParser.json({limit: '50mb'}));
    app.use(bodyParser.urlencoded({limit: '50mb', extended: false}));
    app.use(cookieParser());
    app.engine('html', ejs.__express);
    app.set('view engine', 'html');
    app.use(express.static('public'));
    app.use(proxy());
};