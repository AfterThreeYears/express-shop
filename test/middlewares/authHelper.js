const mongoose = require("mongoose");
const User = mongoose.model('User');
const should = require("should");

exports.createUser = (userName = `测试${Date.now()}`, userPwd = 'test') => {
    const user = new User({
        userName,
        userPwd,
    });
    return user.save();
};

exports.getToken = function (agent, userName) {
	return new Promise(function (resolve, reject) {
		agent
		.post('/users/login')
		.set("Content-Type", "application/x-www-form-urlencoded")
		.send({ userName, userPwd: 'test' })
		.redirects(0)
		.expect(200)
		.end(function(err, res) {
          if (err) { reject(err); }
          res.body.status.should.be.exactly(0);
		  should.exist(res.body.data);
		  resolve(res.body.data);
		});
	});
};