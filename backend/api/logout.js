'use strict';
const XError = require('x-error');

function authValidator (req) {
  const sess = req.session;
  if (!sess || !sess.uid) throw new XError(1001).m('this endpoint requires Login').hc(401);
}

// clears the cookie
function logout (req) {
  const sess = req.session;
  sess.destroy();
  return { status: 'OK' };
}
logout['@before'] = [authValidator];

module.exports = logout;
