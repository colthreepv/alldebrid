'use strict';
const Joi = require('joi');
const XError = require('x-error');
const rp = require('request-promise');

const ad = require('../ad');
const parse = require('./parse');
const storage = require('../components/storage');
const lvl = storage.lvl;

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
  .then(parse.login)
  .catch((login) => {
    if (login.recaptcha) throw new XError(1002).hr('recaptcha appeared').hc(403);
    throw new XError(1000).hr('invalid username/password').hc(401);
  })
  .then(login => storage.setCookies(username, jar.getCookies(ad.base)).return(login))
  .then(login => lvl.putAsync(`user:${login.uid}:uid`, login.username).return(login))
  .then(login => {
    req.session.uid = login.uid;

    return { status: 'ok', redirect: '/' };
  });
}
login['@validation'] = {
  body: {
    username: Joi.string().required(),
    password: Joi.string().required()
  }
};

module.exports = login;
