'use strict';
const serveStatic = require('serve-static');

exports = module.exports = function (config) {
  return serveStatic(config.rootDir);
};
exports['@singleton'] = true;
exports['@require'] = ['config'];
