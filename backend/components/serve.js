'use strict';
const serveStatic = require('serve-static');

exports = module.exports = function (config) {
  return serveStatic(config.rootDir);
};
exports['@require'] = ['config'];
