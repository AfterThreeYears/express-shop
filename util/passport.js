const passport = require('passport');
const Strategy = require('passport-http-bearer').Strategy;
const path = require('path');
const User = require(path.join(__dirname, '../models/users'));

module.exports = () => {
    passport.use(new Strategy(
        function(token, done) {
            User.findOne({
                token: token
            }, (err, user) => {
                if (err) {
                    return done(null, {msg: err.message});
                }
                if (!user) {
                    return done(null, {msg: '错误的token'});
                }
                return done(null, user);
            })
        }
    ))
};