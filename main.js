var Hapi = require('hapi'),
    Path = require('path'),
    Mongoose = require('mongoose'),
    NunjucksHapi = require('nunjucks-hapi'),
    Q = require('q'),
    Config = require('./config'),
    Preferences = require('./database_models/preferences');


// ------------------------------------
// Wrap each chunk required for startup as it's own promise-compatible function, then
// call everything sequentially at the end so it executes in order and fails gracefully.
// ------------------------------------

// Setup and connect to the database
function setupMongoose () {
    var deferred = Q.defer(),
        mongooseUri = "mongodb://" + Config.mongo.address + ":" + Config.mongo.port + "/" + Config.mongo.database;

    if (Config.mongo.username && Config.mongo.password) {
        mongooseUri = "mongodb://" + Config.mongo.username + ":" + Config.mongo.password + "@" + Config.mongo.address + ":" + Config.mongo.port + "/" + Config.mongo.database;
    }
    Mongoose.connect(mongooseUri);
    var db = Mongoose.connection;
    db.on('error', function (err) {
        deferred.reject("Error connecting to database: " + err);
    });
    db.once('open', function () {
        deferred.resolve("Connected to database: " + mongooseUri);
    });

    return deferred.promise;
}

// Load preferences or set defaults if they do not exist
function loadPreferences () {
    var deferred = Q.defer();

    Preferences.findOne(function (err, preferences) {
        if (err) {
            deferred.reject("Error getting preferences: " + err);
        }

        if (preferences) {
            deferred.resolve("Loaded preferences: " + preferences);
        } else {
            var prefs = new Preferences();
            prefs.save(function (err, preferences) {
                if (err) {
                    deferred.reject("Error creating default preferences: " + err);
                } else {
                    deferred.resolve("No preferences found. Created default preferences: " + preferences);
                }
            });
        }
    });

    return deferred.promise;
}

// Setup the Hapi server
function setupHapi () {
    var deferred = Q.defer(),
        server = new Hapi.Server();

    server.connection({ port: Config.server.port });

    // Register Hapi plugins
    server.register(require('hapi-auth-cookie'), function (err) {
        if (err) {
            deferred.reject("Error registering hapi-auth-cookie: " + err);
        }

        server.auth.strategy('session', 'cookie', {
            password: Config.security.cookie.secret,
            cookie: Config.security.cookie.name,
            redirectTo: '/login',
            isSecure: Config.security.cookie.isSecure,
            ttl: Config.security.cookie.ttl
        });
    });

    // Potentially log all incoming requests
    /*
    server.ext('onRequest', function (request, next) {
        console.log(request.path, request.query);
        next();
    });
    */

    // Create the routes
    server.route(require('./hapi_routes/all'));

    // Setup Nunjucks as the templating engine
    server.views({
        engines: {
            html: NunjucksHapi
        },
        path: Config.nunjucks.templatePath
    });
    NunjucksHapi.configure(Config.nunjucks.templatePath);

    // Start the Hapi server
    server.start(function (err) {
        if (err) {
            deferred.reject("Error starting Hapi server: " + err);
        }

        deferred.resolve("Hapi server running at: " + server.info.uri);
    });

    return deferred.promise;
}


// Run all of the asyncronous setup and log the results of each step
Q.fcall(setupMongoose).then(console.log)
.then(loadPreferences).then(console.log)
.then(setupHapi).then(console.log)
.catch(function (err) {
    console.log(err);
})
.done();