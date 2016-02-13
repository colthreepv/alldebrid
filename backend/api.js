'use strict';

const Joi = require('joi');
const rp = require('request-promise');
const ad = require('./ad');
const parse = require('./parse');
// all those functions will return a promise

// sets a cookie
function login (req) {
  const email = req.body.email;
  const password = req.body.password;
  const jar = rp.jar();
  return rp({
    url: ad.register,
    qs: {
      action: 'login',
      'login_login': email,
      'login_password': password
    },
    jar
  })
  .then(parse.login)
  .then(data => {
    console.log(data);
    console.log(jar.getCookies());
  })
  .catch(console.log);
}
login['@validation'] = {
  body: {
    email: Joi.string().email().required(),
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

module.exports = { login, torrent, add, convert };
