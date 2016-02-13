'use strict';
const ad = require('./ad');
const cheerio = require('cheerio');
const Promise = require('bluebird');
const rp = require('request-promise');
const storage = require('./storage');
const redis = storage.redis;

const fs = require('fs');

function parseLogin (pageBody) {
  fs.writeFileSync('page.html', pageBody);
  const $ = cheerio.load(pageBody);
  if ($('.login textarea[name="recaptcha_challenge_field"]')) {
    // A wild recaptcha appears
    return Promise.reject({ logged: false, recaptcha: true });
  }
  if ($('#toolbar span a.toolbar_welcome')) {
    return Promise.reject({ logged: false, recaptcha: false });
  }
  if ($('strong a')) {
    const days = $('.toolbar_welcome').textContent.match(/in (\d*) days/);
    const username = $('strong a').textContent;
    const logoutKey = $('.toolbar_disconnect').getAttribute('href').split('key=')[1];

    // retrieve user UID and give back to user
    return retrieveUid(username, logoutKey).then(uid => {
      return {
        uid,
        logged: true,
        username,
        remainingDays: days ? parseInt(days[1], 10) : 0,
        logoutKey
      };
    });
  }
}


// when retrieving details of an user, it misses an unique uid necessary for logout
// this function helps in that
function retrieveUid (username, logoutKey) {
  return redis
    .get(`user:uid:${ logoutKey }`)
    .then((value) => {
      if (value == null) return fetchUid(logoutKey);
      return value;
    });
}

function fetchUid (username, logoutKey) {
  storage
    .getCookies(username)
    .then(cookies => {
      const j = rp.jar(cookies);
      return rp({
        url: ad.torrent,
        jar: j
      });
    })
    .then(pageBody => {
      const uid = pageBody.match(/name="uid" value="(.*)"/)[1];
      return redis.set(`user:uid:${ logoutKey }`, uid).return(uid); // write uid back
    });
}

exports.login = parseLogin;
