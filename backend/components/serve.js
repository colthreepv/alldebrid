'use strict';
const serveStatic = require('serve-static');
const config = rootRequire('./config');

module.exports = serveStatic(config.rootDir);
