'use strict';
const config = rootRequire('./config');

const session = require('express-session');
const LevelStore = require('express-session-level')(session);
const sessionStorage = require('levelup')(config.sessionStorage);

const sessionConf = Object.assign({}, config.session, {
  store: new LevelStore(sessionStorage)
});

module.exports = session(sessionConf);
