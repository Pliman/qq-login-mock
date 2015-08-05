var express = require('express');
var app = express();

var path = require('path');

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// use cookie and session
app.use(require('express-session')({
	secret: "sessio@n key must b3e a sec!ret",
	saveUninitialized: true,
	resave: true,
	// set session timeout
	cookie: {
		path: '/',
		httpOnly: true,
		maxAge: 60 * 60 * 1000
	}
}));

app.post('/login', function (req, res, next) {
	var user = { name: 'tom', password: '1111', avatar: 'u1.png'}
	res.send({
		result : 'SUCCESS',
		msg : 'Login success!!!',
		data : user
	});
});

app.use(express.static(path.join(__dirname, 'app')));

var server = app.listen(3001, function () {
	console.log("listening on port %d in %s mode", 3001, app.settings.env);
});