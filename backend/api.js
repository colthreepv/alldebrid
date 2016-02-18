'use strict';

const Joi = require('joi');
const rp = require('request-promise');
const ad = require('./ad');
const parse = require('./parse');
const storage = require('./storage');
// all those functions will return a promise

// sets a cookie
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
  .then((page) => {
    return storage.setCookies(username, jar.getCookies(ad.base)).return(page);
  })
  .then(parse.login);
}
login['@validation'] = {
  body: {
    username: Joi.string().required(),
    password: Joi.string().required()
  }
};

function authValidator (req, res, next) {
  // if (req.cookie && )
}

// clears the cookie, does not return promise
function logout (req, res) {
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

function pprint (err) {
  const util = require('util');
  console.log(util.inspect(err.stack, { colors: true, depth: null }));
}

module.exports = { login, torrent, add, convert };
