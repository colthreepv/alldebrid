'use strict';
const cheerio = require('cheerio');

const ad = rootRequire('./ad');
const errorCodes = rootRequire('./components/error-codes');
const parse = rootRequire('./util/parse-login');
const rp = rootRequire('./components/request');
const storage = rootRequire('./components/storage');

const err = {
  invalidCredentials: errorCodes.add(1000, 'user/pass combination invalid'),
  recaptchaAppeared: errorCodes.add(1002, 'recaptcha appeared'),
  parseError: errorCodes.add(1003, 'unexpected login error, maybe page change?')
};

// debug-only
function dumpLogin (response) {
  const fs = require('fs');
  fs.writeFileSync('login.html', response.body);
}

// sets a cookie - via express-session
function login (qs) {
  const username = qs.login_login;

  const jar = rp.jar();

  return rp({
    url: ad.register,
    qs,
    followRedirect: false,
    jar
  })
  .then(response => {
    const uid = parse.detectLogin(response.headers['set-cookie']);
    if (uid) return completeLogin(response.headers.location, uid);
    // try to understand which error happened
    return Promise.reject(cheerio.load(response.body));
  });


  // promise.chain terminator in case Login is succesful
  function completeLogin (url, uid) {
    return rp({ url, jar })
    .then(response => cheerio.load(response.body))
    .then($ => parse.userData($, uid))
    .then(login => storage.setCookies(username, jar.getCookies(ad.base)).return(login));
  }

}

module.exports = login;
