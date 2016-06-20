'use strict';
const promesso = require('promesso');
const errorCodes = require('../components/error-codes');

const auth = require('../util/auth');

const err = {
  html: errorCodes.add(2000, 'requested an non-HTML page on a /pages/ endpoint')
};

const api = {
  login: require('./login'),
  main: require('./main')
};

function html5fallback (req) { if (!req.accepts('html')) throw err.html().hc(404); }
function redirectToLogin (req, res) { if (!auth.isValid(req.session)) return res.redirect('/login'); }
redirectToLogin['@raw'] = true;

module.exports = {
  login: promesso([html5fallback, api.login]),
  main: promesso([html5fallback, redirectToLogin, api.main])
};
