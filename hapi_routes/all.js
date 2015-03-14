var static_routes = require('./static'),
	authentication_routes = require('./authentication'),
	message_routes = require('./messages'),
	all_routes = [];

Array.prototype.push.apply(all_routes, static_routes);
Array.prototype.push.apply(all_routes, authentication_routes);
Array.prototype.push.apply(all_routes, message_routes);
module.exports = all_routes;