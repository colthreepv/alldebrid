'use strict';
const cheerio = require('cheerio');

const ad = rootRequire('./ad');
const rp = rootRequire('./components/request');

const loginApi = rootRequire('./api/login');
const unlockApi = rootRequire('./api/unlock');
const loginSuccess = rootRequire('./pages/login-success');

// first page load goes to login()
function login () {
  return rp({
    url: ad.register
  })
  // .tap(dumpLogin)
  .then(response => cheerio.load(response.body))
  .then(editForm);
}

function unlock (req) {
  const body = req.body;
  const unlockP = unlockApi(body);

  const successChain = (login) => {
    return Promise.resolve(replyUser(req, login))
    .then(() => loginSuccess);
  };

  // failure just edits the form again
  const failChain = ($) => editForm($);

  // then have success or failure
  return unlockP.then(successChain, failChain);
}

// login() POSTs to intercept()
function intercept (req) {
  const body = req.body;
  // parses payload
  const loginP = loginApi(body);
  console.log(body);

  const successChain = (login) => {
    return Promise.resolve(replyUser(req, login))
    .then(() => loginSuccess);
  };

  // failure just edits the form again
  const failChain = ($) => editForm($);

  // then have success or failure
  return loginP.then(successChain, failChain);
}

exports.login = login;
exports.unlock = unlock;
exports.intercept = intercept;

function editForm ($) {
  const loginForm = $('.login > form');
  const unlockField = $('input[name="unlock_token"]');

  if (unlockField.length) {
    loginForm.attr('method', 'POST');
    loginForm.attr('action', '/ad/unlock');
    return $.html();
  }

  if (loginForm.length) {
    loginForm.attr('method', 'POST');
    loginForm.attr('action', '/ad/');
  }

  return $.html();
}

function replyUser (req, login) {
  req.session.uid = login.uid;
  req.session.username = login.username;
  req.session.user = {};
  for (const key in login) {
    req.session.user[key] = login[key];
  }

  return { status: 'ok', redirect: `${req.protocol}://${req.headers.host}/` };
}

// debug-only
function dumpLogin (response) {
  const fs = require('fs');
  fs.writeFileSync('adlogin.html', response.body);
}
