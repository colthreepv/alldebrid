'use strict';
const errorCodes = rootRequire('./components/error-codes');
const auth = rootRequire('./util/auth');

const err = {
  html: errorCodes.add(2000, 'requested an non-HTML page on a /pages/ endpoint')
};

function html5fallback (req) { if (!req.accepts('html')) throw err.html().hc(404); }
function redirectToLogin (req, res, next) {
  if (!auth.isValid(req.session)) return res.redirect('/login');
  return next();
}
redirectToLogin['@raw'] = true;

function redirectToHome (req, res, next) {
  if (auth.isValid(req.session)) return res.redirect('/');
  return next();
}
redirectToHome['@raw'] = true;

const pages = {
  login: require('./login'),
  main: require('./main')
};

module.exports = {
  login: [html5fallback, redirectToHome, pages.login],
  main: [html5fallback, redirectToLogin, pages.main]
};
