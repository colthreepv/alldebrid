'use strict';
const config = require('../config');

const session = require('express-session');
const LevelStore = require('express-session-level')(session);
const sessionStorage = require('level')(config.sessionStorage);

const sessionConf = Object.assign({}, config.session, {
  store: new LevelStore(sessionStorage)
});

module.exports = session(sessionConf);
