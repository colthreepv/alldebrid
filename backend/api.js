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
  // .then() - HANDLE login failure
  .then(login => {
    // if (login.logged !== true) throw new XError(1000).m('invalid username/password').hc(401);
    if (login.logged !== true) {
      res.status(401).send('Invalid username/password combination');
      return false;
    }
    return login;
  })
  .then(login => {
    return storage.setCookies(username, jar.getCookies(ad.base)).return(login);
  })
  .then(login => lvl.putAsync(`user:${ login.uid }:uid`, login.username).return(login))
  .then(login => {
    return [
      {
        method: 'cookie',
        args: [ 'uid', login.uid, { domain: config.domain, secure: true, httpOnly: true } ]
      },
      {
        method: 'redirect',
        args: [ '/' ]
      }
    ];
  });
}
login['@validation'] = {
  body: {
    username: Joi.string().required(),
    password: Joi.string().required()
  }
};
login['@type'] = 'raw';

function authValidator (req, res, next) {
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
