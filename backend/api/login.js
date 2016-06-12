'use strict';
const Joi = require('joi');
const XError = require('x-error');
const cheerio = require('cheerio');

const ad = require('../ad');
const parse = require('./parse');
const storage = require('../components/storage');
const rp = require('../components/request');

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
    jar
  })
  .tap(response => console.log(response.headers['set-cookie']))
  .then(response => {
    const uid = parse.detectLogin(response.headers['set-cookie']);
    if (uid) return completeLogin(response, uid);
    // try to understand which error happened
    return parse.loginError(cheerio.load(response.body));
  })
  .then(login => {
    if (login.unlockToken) return unlockRequest(login);
    if (login.recaptcha) throw new XError(1002).hr('recaptcha appeared').hc(403);
    if (login.error) throw new XError(1003).hr(login.error).hc(412);
    throw new XError(1000).hr('invalid username/password').hc(401).debug(login);
  });

  // promise.chain terminator in case Login is succesful
  function completeLogin (response, uid) {
    return parse.userData(response.body, uid)
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
}
login['@validation'] = {
  body: {
    username: Joi.string().required(),
    password: Joi.string().required()
  }
};

module.exports = login;
