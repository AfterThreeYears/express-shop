module.exports = {
    // 加盐次数
    SALT_WORK_FACTOR: 10,
    // 密钥
    secret: 'sixsixsix',
    // 过期时间
    expiresIn: '4m',
    // cookie 过期时间
    cookieMaxAge: 1000 * 60 * 4,
    mongodbUri:  'mongodb://localhost:27017/db_demo',
    redisUrl: '127.0.0.1',
    redisPort: 6379,
    // 设置cookie的名字
    access_token_name: 'access_token',
    corsConfig: {
        origin: true,
        credentials: true,
    },
};