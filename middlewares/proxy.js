const httpProxy = require('http-proxy');
const {appLog} = require('../util/logs');

function proxy() {
    return (req, res, next) => {
        appLog.info(`x-mock-header --- ${req.get('x-mock-header')}`);
        if (req.get('x-mock-header') === 'node') return next();
        appLog.info('req.originalUrl --- ', req.originalUrl);
        httpProxy
        .createProxyServer()
        .web(req, res, {
            target: `http://daily.cms.meipu.cn`,
            changeOrigin: true,
        },  (error) => {
        appLog.info('error --- ', error);
        const status = {
          ECONNREFUSED: 503,
          ETIMEOUT: 504,
        }[e.code];
        if (status) res.status = status;
        res.json({
            msg: e,
        });
    });
  };
}

module.exports = proxy;
