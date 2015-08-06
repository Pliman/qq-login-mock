var OAuth = require('oauth'),
	config = require('../config/config');

var authentication = module.exports;

authentication.getAccessToken = function (userName, password, cb) {
	var oauth2 = new OAuth.OAuth2(config.oauth.appId, config.oauth.appSecret, config.oauth.host + ':' + config.oauth.port);

	oauth2.getOAuthAccessToken(
		'',
		{'grant_type': 'password', 'username': userName, 'password': password},
		function (e, access_token, refresh_token, results) {
			cb && cb(e, access_token);
		});
};