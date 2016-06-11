'use strict';
const errorCodes = require('../components/error-codes');
const auth = require('../util/auth');

const err = {
  notLogged: errorCodes.add(1001, 'this endpoint requires Login')
};

// clears the cookie
function logout (req) {
  if (!auth.isValid(req.session)) throw err.notLogged().hc(401);
  req.session.destroy();
  return { status: 'OK' };
}

module.exports = [auth.isValid, logout];
