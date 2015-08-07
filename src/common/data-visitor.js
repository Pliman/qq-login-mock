var http = require('http'),
	config = require('../config/config');

var dataVisitor = module.exports;

// filterObj 暂时只支持字符串，等号过滤条件
dataVisitor.visit = function (collection, filterObj, cb) {
	var path = '/' + collection + '?$filter=' + getFilterString(filterObj);

	var params ={
		path: path,
		host: config.data.host,
		port: config.data.port,
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

function getFilterString(filterObj) {
	var conditions = [];
	for (var k in filterObj) {
		if (filterObj.hasOwnProperty(k)) {
			conditions.push(k + " eq '" + filterObj[k] + "'")
		}
	}

	return encodeURIComponent(conditions.join(' and '));
}