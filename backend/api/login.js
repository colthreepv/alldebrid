'use strict';
const Joi = require('joi');
const cheerio = require('cheerio');
const replyUser = require('./common-login').replyUser;

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
function login (req) {
  const username = req.body.username;
  const password = req.body.password;
  const jar = rp.jar();

  const recaptcha = req.body.recaptcha;

  const qs = {
    action: 'login',
    login_login: username,
    login_password: password
  };

  if (recaptcha) {
    qs.recaptcha_challenge_field = recaptcha.challenge;
    qs.recaptcha_response_field = recaptcha.response;
  }

  return rp({
    url: ad.register,
    qs,
    followRedirect: false,
    jar
  })
  .tap(dumpLogin)
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
    .then(login => replyUser(req, login));
  }

  // promise-chain terminator in case of alldebrid requests for user intervention to unlock
  function unlockRequest (loginObject) {
    const response = loginObject.unlockData;
    // FIXME: old promesso format!!!
    return [
      { method: 'status', args: [202] },
      { method: 'send', args: [response] }
    ];
  }

  function detectError (response) {
    const login = parse.loginError(cheerio.load(response.body));
    if (login.unlockToken) return unlockRequest(login);
    if (login.recaptcha) throw err.recaptchaAppeared().hr('recaptcha appeared').hc(403);
    if (login.error) throw err.parseError.hr(login.error).hc(412);
    throw err.invalidCredentials().hc(401).debug(login);
  }
}
login['@validation'] = {
  body: {
    username: Joi.string().required(),
    password: Joi.string().required(),

    // in case there is recaptcha informations
    recaptcha: Joi.object().keys({
      challenge: Joi.string().required(),
      response: Joi.string().required()
    })
  }
};

module.exports = login;
