var odata = require('node-odata');
var server = odata('mongodb://localhost/login-app');

server.resource('users', { name: String, password: String, avatar: String});

server.listen(3000);