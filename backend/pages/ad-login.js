'use strict';
const cheerio = require('cheerio');

const ad = rootRequire('./ad');
const rp = rootRequire('./components/request');

const loginApi = rootRequire('./api/login');

function login () {
  return rp({
    url: ad.register
  })
  // .tap(dumpLogin)
  .then(response => cheerio.load(response.body))
  .then(editForm);
}

function intercept (req) {
  const body = req.body;
  const loginP = loginApi(body);
  console.log(body);

  const successChain = (login) => {
    return Promise.resolve(replyUser(req, login))
    .then(() => '<h1>SO GOOD!</h1>');
  };

  const failChain = ($) => editForm($);

  return loginP.then(successChain, failChain);
}

exports.login = login;
exports.intercept = intercept;

function editForm ($) {
  const loginForm = $('.login > form');
  // FIXME: error here
  // if (!loginForm.length)

  loginForm.attr('method', 'POST');
  loginForm.attr('action', '/ad/');

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
