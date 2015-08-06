var httpReqSender = require('../common/oauth-client');

var login = module.exports;

login.doLogin = function (req, res, next) {
	var user = { name: req.body.userName, password: req.body.userPassword, avatar: 'u1.png'};

	res.send({
		result : 'SUCCESS',
		msg : 'Login success!!!',
		data : user
	});
}