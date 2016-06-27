'use strict';
exports = module.exports = function (errorCodes, auth) {

  // clears the cookie
  function logout (req) {
    req.session.destroy();
    return { status: 'OK' };
  }

  return [auth.api, logout];
};
exports['@singleton'] = true;
exports['@require'] = [
  'components/error-codes',
  'util/auth'
];
