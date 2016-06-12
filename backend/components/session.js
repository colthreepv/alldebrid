'use strict';

exports = module.exports = function (config) {
  const session = require('express-session');
  const LevelStore = require('express-session-level')(session);
  const sessionStorage = require('levelup')(config.sessionStorage);

  const sessionConf = Object.assign({}, config.session, {
    store: new LevelStore(sessionStorage)
  });

  return session(sessionConf);
};
exports['@require'] = ['config'];
