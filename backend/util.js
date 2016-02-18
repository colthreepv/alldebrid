'use strict';
const request = require('request');
const ad = require('./ad');

// same as getCookies, but returns a request.jar
function makeJar (cookies, uri) {
  const url = uri || ad.base;
  const j = request.jar();
  cookies.forEach(c => j.setCookie(c, url));
  return j;
}

module.exports = { makeJar };
