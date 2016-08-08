'use strict';
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });
urlencodedParser['@raw'] = true;

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

const ad = require('./ad-login');
const pages = {
  adLogin: ad.login,
  adIntercept: ad.intercept,

  login: require('./login'),
  main: require('./main')
};

module.exports = {
  adLogin: [pages.adLogin],
  adIntercept: [urlencodedParser, pages.adIntercept],

  login: [html5fallback, redirectToHome, pages.login],
  main: [html5fallback, redirectToLogin, pages.main]
};
