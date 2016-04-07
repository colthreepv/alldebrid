'use strict';
const serveStatic = require('serve-static');
const config = require('../config');
const serveMiddleware = serveStatic(config.buildDir);

function serve (req, res, next) {
  req.url = req.url.replace('/build/', '');
  next();
}

module.exports = [serve, serveMiddleware];
