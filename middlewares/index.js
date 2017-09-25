const cors = require('cors');
const ejs = require('ejs');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const passport = require('passport');
const compression = require('compression');
const {corsConfig} = require('../config');

module.exports = (app) => {
    // view engine setup
    // app.set('views', path.join(__dirname, 'views'));
    // app.set('view engine', 'jade');
    // app.engine('html', ejs.__express);
    // app.set('view engine', 'html');
    app.use(compression());
    app.use(cors(corsConfig));
    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser());
};