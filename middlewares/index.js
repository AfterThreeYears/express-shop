const cors = require('cors');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const passport = require('passport');
const compression = require('compression');
const {corsConfig} = require('../config');
const proxy = require('./proxy');

module.exports = (app) => {
    app.use(compression());
    app.use(cors(corsConfig));
    app.use(logger('dev'));
    app.use(bodyParser.json({limit: '10mb'}));
    app.use(bodyParser.urlencoded({limit: '10mb', extended: false}));
    app.use(cookieParser());
    app.use(proxy());    
};