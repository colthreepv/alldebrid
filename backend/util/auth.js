'use strict';

function isValid (reqSession) {
  if (!reqSession || !reqSession.uid) return false;
  return true;
}

exports = module.exports = function (errorCodes) {
  const err = {
    notLogged: errorCodes.add(1001, 'this endpoint requires Login')
  };

  function authenticateAPI (req) {
    const reqSession = req.session;
    if (!isValid(reqSession)) throw err.notLogged().hc(401);
  }

  return {
    api: authenticateAPI,
    isValid
  };

};
exports['@singleton'] = true;
exports['@require'] = [
  'components/error-codes'
];
