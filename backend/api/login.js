'use strict';
const Joi = require('joi');
const XError = require('x-error');
const rp = require('request-promise');

const ad = require('../ad');
const parse = require('./parse');
const storage = require('../components/storage');
const lvl = storage.lvl;

const fs = require('fs');
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
  .promise().tap(page => fs.writeFileSync('login.html', page))
  .then(parse.login)
  .catch(login => {
    if (login.recaptcha) throw new XError(1002).hr('recaptcha appeared').hc(403);

    if (login.error) throw new XError(1003).hr(login.error).hc(412);
    throw new XError(1000).hr('invalid username/password').hc(401).debug(login);
  })
  .then(login => storage.setCookies(username, jar.getCookies(ad.base)).return(login))
  .then(login => login.unlockToken ? unlockRequest(login) : completeLogin(login));

  // promise.chain terminator in case Login is succesful
  function completeLogin (cheerioPage) {
    return parse.userData(cheerioPage)
    .then(login => lvl.putAsync(`user:${login.uid}:uid`, login.username).return(login))
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
