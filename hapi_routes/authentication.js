var Joi = require('joi'),
    User = require('../database_models/user'),
    Config = require('../config');

// The login page
var loginPageRoute = {
    method: 'GET',
    path: '/login',
    config: {
        auth: {
            mode: 'try',
            strategy: 'session'
        },
        plugins: {
            'hapi-auth-cookie': {
                redirectTo: false
            }
        },
        handler: function(request, reply) {
            if (request.auth.isAuthenticated) {
                return reply.redirect('/');
            }

            reply.view("login.html", { app: Config.app });
        }
    }
};

// Attempts to log the user in given the credentials
var loginPostRoute = {
    method: 'POST',
    path: '/login',
    config: {
        validate: {
            payload: {
                email: Joi.string().email().required(),
                password: Joi.string().required()
            }
        },
        auth: {
            mode: 'try',
            strategy: 'session'
        },
        plugins: {
            'hapi-auth-cookie': {
                redirectTo: false
            }
        },
        handler: function(request, reply) {
            if (request.auth.isAuthenticated) {
                reply({ redirect: "/" });
            }

            User.findOne({ email: request.payload.email }, function (err, user) {
                if (err) throw err;

                if (user) {
                    user.comparePassword(request.payload.password, function(err, isMatch) {
                        if (err) throw err;

                        if (isMatch) {
                            request.auth.session.set(user.getNonSensitiveData());
                            reply({ redirect: "/" });
                        } else {
                            reply({ error: "Invalid credentials" });
                        }
                    });
                } else {

                    var newUser = new User({
                        email: request.payload.email,
                        password: request.payload.password
                    });
                    newUser.save(function (err) {
                        if (err) throw err;

                        request.auth.session.set(newUser.getNonSensitiveData());
                        reply({ redirect: "/" });
                    });
                }
            });
        }
    },
};

// Logging out
var logoutPostRoute = {
    method: ['GET', 'POST'],
    path: '/logout',
    config: {
        auth: 'session',
        handler: function(request, reply) {
            request.auth.session.clear();
            return reply.redirect("/");
            //reply.view("/", { app: Config.app });
        }
    }
}


module.exports = [loginPageRoute, loginPostRoute, logoutPostRoute]