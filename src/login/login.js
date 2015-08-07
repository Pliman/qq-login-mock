var login = module.exports,
	authentication = require('../common/authentication'),
	oauthVisitor = require('../common/oauth2-visitor');

login.doLogin = function (req, res, next) {
	if (req.session.accessToken) {
		getUser(req.body.userName, req.session.accessToken, function (err, data) {
			processUser(err, data, res);
		});
	} else {
		authentication.getAccessToken(req.body.userName, req.body.userPassword, function (err, accessToken) {
			if (err) {
				res.writeHead(401);
				return res.end(err.message);
			}

			req.session.accessToken = accessToken;

			getUser(req.body.userName, req.session.accessToken, function (err, data) {
				processUser(err, data, res);
			});
		});
	}

};

function getUser(userName, accessToken, cb) {
	oauthVisitor.visit('/user/' + userName, accessToken, null, cb);
}

function processUser(err, data, res) {
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