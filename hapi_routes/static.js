var User = require('../database_models/user');

// Serve all files in the 'public' folder as static resources.
// Used to provide css, js, and image files.
var staticFileRoute = {
	method: 'GET',
    path: '/public/{param*}',
    handler: {
        directory: {
            path: 'public',
            listing: false,
            index: true
        }
    }
};

// Serve the 404 route
var FileNotFoundRoute = {
    method: '*',
    path: '/{p*}',
    handler: function(request, reply) {
        reply.view("404.html", {}).code(404);
    }
}

// Serve the root route
var indexRoute = {
    method: 'GET',
    path: '/',
    config: {
        auth: 'session',
        handler: function(request, reply) {
            if (!request.auth.isAuthenticated) {
                reply.redirect("/login");
            }
            
            User.findOne({ email: request.auth.credentials.email }, function (err, user) {
	            if (err) reply({ error: err });
	            
	            if (user) {
	            	reply.view('index.html', {
		            	credentials: request.auth.credentials,
		            	messages: user.myMessages
		            });
				} else {
		            reply.view('index.html', {
		            	credentials: request.auth.credentials
		            });
	            }
            });
        }
    }
}

module.exports = [staticFileRoute, FileNotFoundRoute, indexRoute]