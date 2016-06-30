'use strict';
const errorCodes = rootRequire('./components/error-codes');

const err = {
  notLogged: errorCodes.add(1001, 'this endpoint requires Login')
};

function isValid (reqSession) {
  if (!reqSession || !reqSession.uid) return false;
  return true;
}

function authenticateAPI (req) {
  const reqSession = req.session;
  if (!isValid(reqSession)) throw err.notLogged().hc(401);
}

module.exports = {
  api: authenticateAPI,
  isValid
};
