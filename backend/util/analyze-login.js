'use strict';
const cheerio = require('cheerio');

const ad = rootRequire('./ad');
const rp = rootRequire('./components/request');

// debug-only
function dumpLogin (response) {
  const fs = require('fs');
  fs.writeFileSync('login-get.html', response.body);
}

function analyzeLogin () {
  return rp({
    url: ad.register
  })
  .tap(dumpLogin)
  .then(response => cheerio.load(response.body))
  .then(detect);
}

function detect ($) {
  const recaptcha = detectRecaptcha($);
  if (recaptcha != null) return recaptcha;

  const vpn = detectVPN($);
  if (vpn) return vpn;
  return null;
}

function detectRecaptcha ($) {
  const scripts = $('.login center script');
  if (!scripts.length) return null;
  return { recaptcha: scripts.attr('src') };
}

function detectVPN ($) {
  const arianeEl = $('#ariane');
  if (!arianeEl.length) return null;

  return { message: arianeEl.text() };
}

module.exports = analyzeLogin;
