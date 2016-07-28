'use strict';
const cheerio = require('cheerio');

const ad = rootRequire('./ad');
const rp = rootRequire('./components/request');

// debug-only
function dumpLogin (response) {
  const fs = require('fs');
  fs.writeFileSync('login-get.html', response.body);
}

function requestLogin () {
  return rp({
    url: ad.register
  })
  .tap(dumpLogin)
  .then(response => cheerio.load(response.body))
  .then(detectRecaptcha);
}

function detectRecaptcha ($) {
  const scripts = $('.login center script');
  if (!scripts.length) return null;
  return scripts.attr('src');
}

module.exports = requestLogin;
