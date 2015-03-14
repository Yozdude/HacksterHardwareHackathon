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
            // TODO: add user from request.auth.session and config data
            reply.view('index.html', {});
        }
    }
}

module.exports = [staticFileRoute, FileNotFoundRoute, indexRoute]