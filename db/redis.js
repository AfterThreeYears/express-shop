const redis = require('redis');
const {redisUrl, redisPort} = require('../config');
const redisClient = redis.createClient(redisPort, redisUrl);

module.exports = redisClient;