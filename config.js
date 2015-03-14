var Path = require('path');

module.exports = {
    mongo: {
        // If you need a username and password, add them as 'username' and 'password' fields
        address: 'localhost',
        port: '27017',
        database: 'nodejs_base'
    },
    server: {
        port: 8000
    },
    nunjucks: {
        templatePath: Path.join(__dirname, 'html_templates')
    },
    app: {
        name: "Node.js Base",
        version: "1.0",
        creatorName: "Yozdude",
        creatorUrl: "https://github.com/Yozdude"
    },
    security: {
        cookie: {
            secret: 'superseekrit',
            name: 'nodejs_base_cookie',
            isSecure: false, // Change to true if you're using SSL
            ttl: 7 * 24 * 60 * 60 * 1000 // Time-to-live of 7 days
        }
    }
};