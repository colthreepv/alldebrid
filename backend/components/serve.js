'use strict';
const serveStatic = require('serve-static');
const config = require('../config');
const serve = serveStatic(config.rootDir);

module.exports = serve;
