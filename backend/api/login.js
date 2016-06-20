'use strict';
const Joi = require('joi');
const XError = require('x-error');
const cheerio = require('cheerio');

const ad = require('../ad');
const parse = require('./parse');
const storage = require('../components/storage');
const rp = require('../components/request');

// debug-only
function dumpLogin (response) {
  const fs = require('fs');
  fs.writeFileSync('login.html', response.body);
}

// sets a cookie - via express-session
function login (req) {
  const username = req.body.username;
  const password = req.body.password;
  const jar = rp.jar();

  return rp({
    url: ad.register,
    qs: {
      action: 'login',
      'login_login': username,
      'login_password': password
    },
    followRedirect: false,
    jar
  })
  .then(response => {
    const uid = parse.detectLogin(response.headers['set-cookie']);
    if (uid) return completeLogin(response.headers.location, uid);
    // try to understand which error happened
    return detectError(response);
  });


  // promise.chain terminator in case Login is succesful
  function completeLogin (url, uid) {
    return rp({ url, jar })
    .then(response => cheerio.load(response.body))
    .then($ => parse.userData($, uid))
    .then(login => storage.setCookies(username, jar.getCookies(ad.base)).return(login))
    .then(login => {
      req.session.uid = login.uid;

      return { status: 'ok', redirect: '/' };
    });
  }

  // promise-chain terminator in case of alldebrid requests for user intervention to unlock
  function unlockRequest (loginObject) {
    const response = loginObject.unlockData;
    return [
      { method: 'status', args: [202] },
      { method: 'send', args: [response] }
    ];
  }

  function detectError (response) {
    const login = parse.loginError(cheerio.load(response.body));
    if (login.unlockToken) return unlockRequest(login);
    if (login.recaptcha) throw new XError(1002).hr('recaptcha appeared').hc(403);
    if (login.error) throw new XError(1003).hr(login.error).hc(412);
    throw new XError(1000).hr('invalid username/password').hc(401).debug(login);
  }
}
login['@validation'] = {
  body: {
    username: Joi.string().required(),
    password: Joi.string().required()
  }
};

module.exports = login;
