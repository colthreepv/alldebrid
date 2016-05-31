'use strict';
const serveStatic = require('serve-static');
const config = require('../config');
const buildMiddleware = serveStatic(config.buildDir);
const publicMiddleware = serveStatic(config.publicDir);

function replaceUrl (url) {
  return function (req, res, next) {
    req.url = req.url.replace(url, '');
    console.log(req.url);
    next();
  };
}


exports.assets = [replaceUrl('/build/'), buildMiddleware];
exports.public = [replaceUrl('/public/'), publicMiddleware];
