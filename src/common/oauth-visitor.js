var http = require('http');

var oauthVisitor = module.exports;

oauthVisitor.visit = function (path, accessToken, params, cb) {
	var params ={
		path: path + '?accessToken=' + accessToken,
		host: "localhost",
		port: 3001,
		method: "get"
	};


	var req = http.request(params, function (res) {
		var allData = [];

		res.on('data', function (data) {
			allData.push(data);
		});

		res.on('end', function (data) {
			allData.push(data);
			cb && cb(null, allData);
		})
	});

	req.on('error', function (err) {
		cb && cb(err);
	});

	req.end();
};
