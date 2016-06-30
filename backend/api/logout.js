'use strict';
const auth = rootRequire('./util/auth');

// clears the cookie
function logout (req) {
  req.session.destroy();
  return { status: 'OK' };
}

module.exports = [auth.api, logout];
