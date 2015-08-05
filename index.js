var odata = require('node-odata');

var server = odata('mongodb://localhost/my-app');

server.resource('books', { title: String, price: Number });

server.listen(3000);