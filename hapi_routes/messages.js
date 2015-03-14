var Message = require('../database_models/message');

// Serve the map route
var mapRoute = {
    method: 'GET',
    path: '/my_messages',
    config: {
        auth: 'session',
        handler: function(request, reply) {
            if (!request.auth.isAuthenticated) {
                reply.redirect("/login");
            }
            
            var myMessages = Message.find({ user: request.auth.credentials.email }).exec(function (err, messages) {
	            if (err) throw err;
	            
	            reply.view('my_messages.html', {
	            	credentials: request.auth.credentials,
	            	messages: messages
	            });
            });
        }
    }
}

// Serve the map route
var mapRoute = {
    method: 'GET',
    path: '/map',
    config: {
        auth: 'session',
        handler: function(request, reply) {
            if (!request.auth.isAuthenticated) {
                reply.redirect("/login");
            }
            
            reply.view('map.html', {
            	credentials: request.auth.credentials
            });
        }
    }
}

module.exports = [mapRoute]