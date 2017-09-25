const compose = require('composable-middleware');
const passport = require('passport');
const {checkToken} = require('../util/jwt');

const Authentication = () => {
    return compose()
        .use(checkToken)
        .use(passport.authenticate('bearer', { session: false }))
};


module.exports = {
    Authentication,
};