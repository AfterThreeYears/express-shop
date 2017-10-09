module.exports = (req, res, next) => {
    const isTest = process.env.NODE_ENV === 'test';
    const verifyCode = req.body.verifyCode && req.body.verifyCode.toLowerCase();
    const sessionVerifyCode = req.session.verifyCode && req.session.verifyCode.toLowerCase();
    if (isTest || sessionVerifyCode && sessionVerifyCode === verifyCode) {
        next();
    } else {
        // 每一次失败以后都必须要去重新请求验证码
        req.session.verifyCode = '';
        res.json({
            status: 1,
            msg: '验证码错误',
            data: null,
        });
    }
}