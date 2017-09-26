const cors = require('cors');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const passport = require('passport');
const compression = require('compression');
const {corsConfig} = require('../config');

module.exports = (app) => {
    app.use(compression());
    app.use(cors(corsConfig));
    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser());
};