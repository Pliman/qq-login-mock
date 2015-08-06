var express = require('express'),
	app = express(),
	login = require('./src/login/login');

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

app.post('/login', login.doLogin);

app.use(express.static(path.join(__dirname, 'app')));

var server = app.listen(3002, function () {
	console.log("listening on port %d in %s mode", 3002, app.settings.env);
});