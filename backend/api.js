'use strict';

var Joi = require('joi');
// all those functions will return a promise


// sets a cookie
function login (req) {}
login['@validation'] = {
  body: {
    email: Joi.string().email().required(),
    password: Joi.string().password().required()
  }
};

function authValidator (req, res, next) {
  if (req.cookie && )
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
