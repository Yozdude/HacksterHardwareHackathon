var static_routes = require('./static'),
	authentication_routes = require('./authentication'),
	all_routes = [];

Array.prototype.push.apply(all_routes, static_routes);
Array.prototype.push.apply(all_routes, authentication_routes);
module.exports = all_routes;