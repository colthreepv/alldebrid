'use strict';
const promesso = require('promesso');
const errorCodes = require('../components/error-codes');
const err = {
  html: errorCodes.add(2000, 'requested an non-HTML page on a /pages/ endpoint')
};
console.log(errorCodes.list());

// this wrapper creates a closure that calls the rightful page handler or returns an error
function html5fallback (req) {
  if (req.accepts('html')) throw err.html().hc(404);
}

const api = {
  login: require('./login'),
  main: require('./main')
};

module.exports = {
  login: promesso([html5fallback, api.login]),
  main: promesso([html5fallback, api.main])
};
