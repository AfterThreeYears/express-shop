// const httpProxy = require('http-proxy');
const {appLog} = require('../util/logs');
const Mock = require('../models/mocks');

// const options = {
//     target: `http://daily.cms.meipu.cn`,
//     changeOrigin: true,
//     headers: {
//         Cookie: 'accessToken=eW0x',
//     },
// };

// else if (req.originalUrl.indexOf('proxy') > -1) {
//     httpProxy
//     .createProxyServer()
//     .web(req, res, options, (error) => {
//         appLog.info('error --- ', error);
//         const status = {
//         ECONNREFUSED: 503,
//         ETIMEOUT: 504,
//         }[e.code];
//         if (status) res.status = status;
//         res.json({
//             msg: e,
//         });
//     })
// }

function proxy() {
    return (req, res, next) => {
        appLog.info('req.originalUrl --- ', req.originalUrl);     
        appLog.debug('cookie is', req.cookies);   
        const reg = /^(\/x-mock-cms\/)/;
        if (reg.test(req.originalUrl)) {     
            const path = req.originalUrl.replace(reg, "");
            Mock.findOne({path})
            .then((doc) => {
              if (doc) {
                res.json(JSON.parse(doc.jsonStr));
              } else {
                res.json({
                  errorCode: null,
                  errorMSG: '没有数据',
                  success: false,
                  data: null,
                });
              }
            })
            .catch((err) => {
              res.json({
                errorCode: null,
                errorMSG: err.message,
                success: false,
                data: null,
              });
            });
        } else {
            next();
        }
    };
};

module.exports = proxy;
