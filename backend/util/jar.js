'use strict';
const request = require('request');
const ad = rootRequire('./ad');
const errorCodes = rootRequire('./components/error-codes');
const storage = rootRequire('./components/storage');

const err = {
  noCookies: errorCodes.add(1010, 'cookies not found for such user')
};

// from a getCookies call returns a request.jar
function makeJar (cookies, uri) {
  const url = uri || ad.base;
  const j = request.jar();
  cookies.forEach(c => j.setCookie(c, url));
  return j;
}

// fetches cookies from the db and build a jar with them
// to be used inside APIs
function getJar (username) {
  return storage.getCookies(username)
  .catch(storage.NotFoundError, () => { throw err.noCookies().hc(500).debug(username); })
  .then(makeJar);
}

module.exports = { makeJar, getJar };
