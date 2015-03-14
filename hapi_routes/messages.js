var Joi = require('joi'),
	User = require('../database_models/user'),
	Message = require('../database_models/message');

// Serve the map route
var myMessageRoute = {
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

var setNextMessageRoute = {
    method: 'POST',
    path: '/api/setNextMessage',
    config: {
    	validate: {
            payload: {
                user: Joi.string().required(),
                message: Joi.string().required()
            }
        },
        auth: {
        	mode: 'try',
        	strategy: 'session'
        },
        handler: function(request, reply) {
            User.findOne({ email: request.payload.user }, function (err, user) {
	            if (err) reply({ error: err });
	            
	            if (user) {
	            	user.nextMessage = request.payload.message;
	            	user.save(function (err, user) {
		            	if (err) reply({ error: err });
		            	reply({ success: "Message Set" });
	            	});
	            } else {
		            reply({ error: "No such user as " + request.payload.user });
	            }
            });
        }
    }
}

var getNextMessageRoute = {
    method: 'POST',
    path: '/api/getNextMessage',
    config: {
    	validate: {
            payload: {
                user: Joi.string().required()
            }
        },
        auth: {
        	mode: 'try',
        	strategy: 'session'
        },
        handler: function(request, reply) {
            User.findOne({ email: request.payload.user }, function (err, user) {
	            if (err) reply({ error: err });
	            
	            if (user) {
	            	var msg = user.nextMessage;
	            	user.nextMessage = "";
	            	user.save(function (err, user) {
	            		if (err) reply({ error: err });
	            		
	            		if (msg) {
		            		var message = new Message({
			            		user: request.payload.user,
			            		lng: user.lng,
			            		lat: user.lat,
			            		text: msg
		            		});
		            		message.save(function (err, message) {});
	            		}
	            		
		            	reply({ message: msg });
	            	});
            } else {
		            reply({ error: "No such user as " + request.payload.user });
	            }
            });
        }
    }
}

var setPositionRoute = {
    method: 'POST',
    path: '/api/setPosition',
    config: {
    	validate: {
            payload: {
                user: Joi.string().required(),
                longitude: Joi.number().required(),
                latitude: Joi.number().required()
            }
        },
        auth: {
        	mode: 'try',
        	strategy: 'session'
        },
        handler: function(request, reply) {
            User.findOne({ email: request.payload.user }, function (err, user) {
	            if (err) reply({ error: err });
	            
	            if (user) {
	            	user.lng = request.payload.longitude;
	            	user.lat = request.payload.latitude;
	            	user.save(function (err, user) {
	            		if (err) reply({ error: err });
		            	reply({ done: true });
	            	});
            } else {
		            reply({ error: "No such user as " + request.payload.user });
	            }
            });
        }
    }
}


module.exports = [myMessageRoute, mapRoute, setNextMessageRoute, getNextMessageRoute, setPositionRoute]