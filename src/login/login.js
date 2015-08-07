var login = module.exports,
	authentication = require('../common/authentication'),
	oauthVisitor = require('../common/oauth2-visitor');

login.doLogin = function (req, res, next) {
	// 登陆过，再次登陆，相当于退出，再登陆
	if (req.session.user && req.session.user.name !== 'req.body.userName') {
		req.session.user = null;
		req.session.accessToken = null;
	}

	if (req.session.accessToken) {
		getUser(req.body.userName, req.session.accessToken, function (err, data) {
			processUser(err, data, req, res);
		});
	} else {
		authentication.getAccessToken(req.body.userName, req.body.userPassword, function (err, accessToken) {
			if (err) {
				res.writeHead(401);
				return res.end(err.message);
			}

			req.session.accessToken = accessToken;

			getUser(req.body.userName, req.session.accessToken, function (err, data) {
				processUser(err, data, req, res);
			});
		});
	}

};

function getUser(userName, accessToken, cb) {
	oauthVisitor.visit('/user/' + userName, accessToken, null, cb);
}

function processUser(err, data, req, res) {
	if (err) {
		return res.send({
			result: 'FAILED',
			msg: 'Login failed!',
			data: null
		});
	}

	try {
		var rtn = JSON.parse(data);

		if (rtn.result === 'SUCCESS') {
			req.session.user = rtn.data;

			return res.send({
				result: 'SUCCESS',
				msg: 'Login success!',
				data: rtn.data
			});
		}

		throw 'Login failed!';
	} catch (e) {
		res.send({
			result: 'FAILED',
			msg: e,
			data: null
		});
	}
}

login.doLoginOut = function (req, res) {
	req.session.user = null;
	req.session.accessToken = null;

	return res.send({
		result: 'SUCCESS',
		msg: 'Login out success!',
		data: null
	});
};