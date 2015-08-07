var http = require('http'),
	config = require('../config/config');

var oauthVisitor = module.exports;

oauthVisitor.visit = function (path, accessToken, params, cb) {
	var params ={
		path: path + '?access_token=' + accessToken,
		host: 'localhost',
		port: config.oauth.port,
		method: "get"
	};


	var req = http.request(params, function (res) {
		res.setEncoding('utf8');
		var allData = [];
		res.on('data', function (data) {
			allData.push(data);
		});

		res.on('end', function (data) {
			data && allData.push(data);
			cb && cb(null, allData.join());
		})
	});

	req.on('error', function (err) {
		cb && cb(err);
	});

	req.end();
};

