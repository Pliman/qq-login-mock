var OAuth = require('oauth');

var authentication = module.exports;

authentication.getAccessToken = function () {
	var OAuth2 = OAuth.OAuth2;
	var oauth2 = new OAuth2('1',
		'1secret',
		'http://localhost:3001',
		null,
		'',
		null);

	oauth2.getOAuthAccessToken(
		'',
		{'grant_type': 'password', 'username': 'guest', 'password': '1'},
		function (e, access_token, refresh_token, results) {
			console.log('bearer: ', access_token);
		});
};