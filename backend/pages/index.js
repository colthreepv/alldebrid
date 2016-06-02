'use strict';

// this wrapper creates a closure that calls the rightful page handler or returns an error
function html5fallback (fn) {
  return function (req, res, next) {
    if (req.accepts('html')) fn(req, res, next);
    else next();
  };
}

module.exports = {
  login: html5fallback(require('./login')),
  main: html5fallback(require('./main'))
};
