'use strict';
const promesso = require('promesso');
const errorCodes = require('../components/error-codes');

const auth = require('../util/auth');

const err = {
  html: errorCodes.add(2000, 'requested an non-HTML page on a /pages/ endpoint')
};

const pages = {
  login: require('./login'),
  main: require('./main')
};

function html5fallback (req) { if (!req.accepts('html')) throw err.html().hc(404); }
function redirectToLogin (req, res, next) {
  if (!auth.isValid(req.session)) return res.redirect('/login');
  return next();
}
redirectToLogin['@raw'] = true;

module.exports = {
  login: promesso([html5fallback, pages.login]),
  main: promesso([html5fallback, redirectToLogin, pages.main])
};
