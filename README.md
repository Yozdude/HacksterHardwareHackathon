nodejs_base
===========

A base project to work off of when creating simple Node.js applications. Aims to be straightforward to begin using and to remove the tedious task of implementing the basic functionality that many projects share. Because of this, some functionality is left out (such as OAuth integration) because it requires additional setup outside of this project. I'm mostly writing this so I don't have to re-create a whole bunch of functionality for my own projects, but hopefully others will find it useful as a starting point.


Features
------------

TODO


Setup
------------

TODO


Tech Stack
------------

  - [Hapi][] - Web framework engine
  - [MongoDB][], [Mongoose][] - Persistent storage database
  - [Nunjucks][] - Templating engine
  - [Bootstrap][], [FontAwesome][] - Base styling template and icons


TODO
------------

  - Add minification
  - Switch from css to less/sass/whatever
  - Add live-change updating (like nodemon, but detects changes in css, html, etc)
  - Add caching
  - Make more of the user routing login use promises
  - Add actual logging (instead of just printing to console)
  - Add some basic debug options


[Hapi]: http://hapijs.com/
[MongoDB]: http://www.mongodb.org/
[Mongoode]: http://mongoosejs.com/
[Nunjucks]: http://mozilla.github.io/nunjucks/
[Bootstrap]: http://getbootstrap.com/
[FontAwesome]: http://fortawesome.github.io/Font-Awesome/
