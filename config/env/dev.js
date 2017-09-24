module.exports = {
    // 加盐次数
    SALT_WORK_FACTOR: 10,
    // 密钥
    secret: 'sixsixsix',
    // 过期时间
    expiresIn: '60s',
    mongodbUri:  'mongodb://localhost:27017/test',
    // 设置cookie的名字
    access_token_name: 'access_token',
};