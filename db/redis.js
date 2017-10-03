const redis = require('redis');
const {redisUrl, redisPort} = require('../config');
const redisClient = redis.createClient(redisPort, redisUrl);

const {dbLog} = require('../util/logs');

redisClient.on("error", function (err) {
    dbLog.error('redis error', err);
});

module.exports = redisClient;