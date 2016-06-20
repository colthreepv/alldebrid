'use strict';

function isValid (reqSession) {
  if (!reqSession || !reqSession.uid) return false;
  return true;
}

module.exports = { isValid };
