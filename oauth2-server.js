// simple server with a protected resource at /secret secured by OAuth 2

var OAuth2Provider = require('oauth2-provider').OAuth2Provider,
	express = require('express'),
	session = require('express-session'),
	MemoryStore = require('express-session').MemoryStore,
	bodyParser = require('body-parser'),
	cookieParser = require('cookie-parser');

var dataVisitor = require('./src/common/data-visitor');

// hardcoded list of <client id, client secret> tuples
var myClients = {
	'1': '1secret',
};

var app = express();

// temporary grant storage
var myGrants = {};

var myOAP = new OAuth2Provider({
	crypt_key: 'encryption secret',
	sign_key: 'signing secret'
});

// before showing authorization page, make sure the user is logged in
myOAP.on('enforce_login', function (req, res, authorize_url, next) {
	if (req.session.user) {
		next(req.session.user);
	} else {
		res.writeHead(303, {Location: '/login?next=' + encodeURIComponent(authorize_url)});
		res.end();
	}
});

// render the authorize form with the submission URL
// use two submit buttons named "allow" and "deny" for the user's choice
myOAP.on('authorize_form', function (req, res, client_id, authorize_url) {
	res.end('<html>this app wants to access your account... <form method="post" action="' + authorize_url + '"><button name="allow">Allow</button><button name="deny">Deny</button></form>');
});

// save the generated grant code for the current user
myOAP.on('save_grant', function (req, client_id, code, next) {
	if (!(req.session.user in myGrants))
		myGrants[req.session.user] = {};

	myGrants[req.session.user][client_id] = code;
	next();
});

// remove the grant when the access token has been sent
myOAP.on('remove_grant', function (user_id, client_id, code) {
	if (myGrants[user_id] && myGrants[user_id][client_id])
		delete myGrants[user_id][client_id];
});

// find the user for a particular grant
myOAP.on('lookup_grant', function (client_id, client_secret, code, next) {
	// verify that client id/secret pair are valid
	if (client_id in myClients && myClients[client_id] == client_secret) {
		for (var user in myGrants) {
			var clients = myGrants[user];

			if (clients[client_id] && clients[client_id] == code)
				return next(null, user);
		}
	}

	next(new Error('no such grant found'));
});

// embed an opaque value in the generated access token
myOAP.on('create_access_token', function (user_id, client_id, next) {
	var extra_data = 'blah'; // can be any data type or null
	//var oauth_params = {token_type: 'bearer'};

	next(extra_data/*, oauth_params*/);
});

// (optional) do something with the generated access token
myOAP.on('save_access_token', function (user_id, client_id, access_token) {
	console.log('saving access token %s for user_id=%s client_id=%s', JSON.stringify(access_token), user_id, client_id);
});

// an access token was received in a URL query string parameter or HTTP header
myOAP.on('access_token', function (req, token, next) {
	var TOKEN_TTL = 10000 * 60 * 1000;

	if (token.grant_date.getTime() + TOKEN_TTL > Date.now()) {
		req.session.user = token.user_id;
		req.session.data = token.extra_data;
	} else {
		console.warn('access token for user %s has expired', token.user_id);
	}

	next();
});

// (optional) client authentication (xAuth) for trusted clients
myOAP.on('client_auth', function (client_id, client_secret, username, password, next) {
	dataVisitor.visit('users', {
		name: username,
		password: password
	}, function (err, data) {
		if (err) {
			return next(new Error(err));
		}

		if (!data.value.length) {
			return next(new Error('client authentication denied'));
		}

		if (client_id == '1') {
			var user_id = data.value[0].name;

			return next(null, user_id);
		}

		return next(new Error('client authentication denied'));
	});
});

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.query());
app.use(cookieParser());
app.use(session({
	store: new MemoryStore({reapInterval: 5 * 60 * 1000}),
	secret: 'abracadabra',
	resave: true,
	saveUninitialized: true
}));
app.use(myOAP.oauth());
app.use(myOAP.login());

app.get('/', function (req, res, next) {
	console.dir(req.session);
	res.end('home, logged in? ' + !!req.session.user);
});

app.get('/user/:name', function (req, res) {
	if (req.session.user) {
		dataVisitor.visit('users', {
			name: req.param('name'),
		}, function (err, data) {
			if (err) {
				return next(new Error(err));
			}

			if (!data.value.length) {
				return res.send({
					result: 'FAILED',
					msg: 'no user found!',
					data: null
				});
			}

			return res.send({
				result: 'SUCCESS',
				msg: '',
				data: data.value[0]
			});
		});
	} else {
		next(new Error('client authentication denied'));
	}
});

app.listen(3001);