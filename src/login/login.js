var login = module.exports,
	authentication = require('../common/authentication');

login.doLogin = function (req, res, next) {
	var token = authentication.getAccessToken();

	var user = {
		name: req.body.userName,
		password: req.body.userPassword,
		avatar: 'u1.png'
	};

	res.send({
		result: 'SUCCESS',
		msg: 'Login success!!!',
		data: user
	});
}