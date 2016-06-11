'use strict';
exports = module.exports = function (errorCodes, auth) {
  const err = {
    notLogged: errorCodes.add(1001, 'this endpoint requires Login')
  };

  // clears the cookie
  function logout (req) {
    if (!auth.isValid(req.session)) throw err.notLogged().hc(401);
    req.session.destroy();
    return { status: 'OK' };
  }

  return [auth.isValid, logout];
};
exports['@require'] = [
  'components/error-codes',
  'util/auth'
];
