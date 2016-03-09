'use strict';
const path = require('path');

const Joi = require('joi');
const rp = require('request-promise');
const XError = require('x-error');

const ad = require('./ad');
const config = require(path.join(__dirname, '..', 'config.json'));
const parse = require('./parse');
const storage = require('./storage');
const lvl = storage.lvl;
// all those functions will return a promise

// sets a cookie
function login (req, res) {
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
  .catch(() => {
    throw new XError(1000).m('invalid username/password').hc(401);
  })
  .then(login => {
    return storage.setCookies(username, jar.getCookies(ad.base)).return(login);
  })
  .then(login => lvl.putAsync(`user:${ login.uid }:uid`, login.username).return(login))
  .then(login => {
    req.session.uid = login.uid;

    return {
      method: 'redirect',
      args: [ '/' ]
    };
  });
}
login['@validation'] = {
  body: {
    username: Joi.string().required(),
    password: Joi.string().required()
  }
};

function authValidator (req, res, next) {
  const sess = req.session;
  if (!sess || !sess.uid) throw new XError()
  // if (req.cookie && )
}

// clears the cookie, does not return promise
function logout (req, res) {
  const username = req.user.username;
  // res.setHeader "clear cookie";
}
logout['@before'] = [authValidator];
logout['@type'] = 'raw';

// authenticated APIs
// retrieve torrents, all of them
function torrent (req) {}
// add torrent to your service
function add (req) {}
// converts torrent to http links
function convert (req) {}

module.exports = { login, torrent, add, convert };
