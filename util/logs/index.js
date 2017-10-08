var log4js = require('log4js');
const isProd = process.env.NODE_ENV === 'prodction';
const isTest = process.env.NODE_ENV === 'test';
const out = ['out'];

const combine = (arr) => {
    if (isProd || isTest) {
        return arr;
    } else {
        return [...arr, ...out];
    };
};

log4js.configure({
    appenders: {
        out: {type: 'stdout'},
        all: {type: 'file', filename: './logs/all.log'},
        www: {type: 'dateFile', filename: './logs/www.log'}, 
        app: {type: 'dateFile', filename: './logs/app.log'},
        mock: {type: 'dateFile', filename: './logs/mock.log'},
        db: {type: 'dateFile', filename: './logs/db.log'},        
    },
    categories: {
        default: { appenders: out, level: 'all' },
        app: { appenders: combine(['all', 'app']), level: 'all' },
        www: { appenders: combine(['all', 'www']), level: 'all' },
        mock: { appenders: combine(['all', 'mock']), level: 'all' },
        db: { appenders: combine(['all', 'db']), level: 'all' },
    },
});

const wwwLog = log4js.getLogger('www');
const appLog = log4js.getLogger('app');
const mockLog = log4js.getLogger('mock');
const dbLog = log4js.getLogger('db');

module.exports = {
    wwwLog,
    appLog,
    mockLog,
    dbLog,
};
