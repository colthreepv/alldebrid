'use strict';
const ioc = require('../ioc');

exports = module.exports = function (errorCodes, auth) {
  const err = {
    html: errorCodes.add(2000, 'requested an non-HTML page on a /pages/ endpoint')
  };

  const pages = {
    login: ioc.create('pages/login'),
    main: ioc.create('pages/main')
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

  return {
    login: [html5fallback, redirectToHome, pages.login],
    main: [html5fallback, redirectToLogin, pages.main]
  };
};
exports['@require'] = ['components/error-codes', 'util/auth'];
