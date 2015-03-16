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
            
            var myMessages = Message.find().exec(function (err, messages) {
	            if (err) throw err;
	            
	            reply.view('map.html', {
	            	credentials: request.auth.credentials,
	            	messages: JSON.stringify(messages)
	            });
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
        plugins: {
        	'hapi-auth-cookie': {
        		redirectTo: false
        	}
        },
        /*
        auth: {
        	mode: 'try',
        	strategy: 'session'
        },
        */
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
	            		
	            		console.log("Got getNextMessage request. Responding with " + msg);
		            	reply(msg);
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

var newMessageRoute = {
    method: 'POST',
    path: '/api/newMessage',
    config: {
    	validate: {
            payload: {
                user: Joi.string().required(),
                text: Joi.string().required()
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
	            	user.myMessages.push(request.payload.text);
	            	user.save(function (err, user) {
	            		if (err) reply({ error: err });
		            	reply({ redirect: "/" });
	            	});
				} else {
		            reply({ error: "No such user as " + request.payload.user });
	            }
            });
        }
    }
}

var deleteMessageRoute = {
    method: 'POST',
    path: '/api/deleteMessage',
    config: {
    	validate: {
            payload: {
                user: Joi.string().required(),
                index: Joi.number().required()
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
	            	user.myMessages.splice(request.payload.index, 1);
	            	user.save(function (err, user) {
	            		if (err) reply({ error: err });
		            	reply({ redirect: "/" });
	            	});
				} else {
		            reply({ error: "No such user as " + request.payload.user });
	            }
            });
        }
    }
}

// a%40a.com
var getNextMessageGetRoute = {
    method: 'GET',
    path: '/api/getNextMessageGet',
    config: {
        plugins: {
        	'hapi-auth-cookie': {
        		redirectTo: false
        	}
        },
        handler: function(request, reply) {
        	console.log("getNextMessageGet");
            User.findOne({ email: "a@a.com" }, function (err, user) {
	            if (err) reply({ error: err });
	            
	            if (user) {
	            	var msg = user.nextMessage;
	            	user.nextMessage = "";
	            	user.save(function (err, user) {
	            		if (err) reply({ error: err });
	            		
	            		if (msg) {
		            		var message = new Message({
			            		user: "a@a.com",
			            		lng: user.lng,
			            		lat: user.lat,
			            		text: msg
		            		});
		            		message.save(function (err, message) {});
	            		}
	            		
	            		console.log("Got getNextMessageGet request. Responding with " + msg);
		            	reply(msg);
	            	});
				} else {
		            reply({ error: "No such user as a@a.com" });
	            }
            });
        }
    }
}

module.exports = [myMessageRoute, mapRoute, setNextMessageRoute, getNextMessageRoute, setPositionRoute, newMessageRoute, deleteMessageRoute, getNextMessageGetRoute]