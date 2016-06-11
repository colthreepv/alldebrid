'use strict';
const fs = require('fs');

const cheerio = require('cheerio');
const Promise = require('bluebird');
const rp = require('request-promise');

const makeJar = require('../util/make-jar');
const ad = require('../ad');
const storage = require('../components/storage');
const lvl = storage.lvl;

function parseLogin (pageBody) {
  fs.writeFileSync('page.html', pageBody);
  const $ = cheerio.load(pageBody);

  const recaptcha = $('.login textarea[name="recaptcha_challenge_field"]');
  if (recaptcha.length) {
    // A wild recaptcha appears
    return Promise.reject({ logged: false, recaptcha: true });
  }
  const unlockEl = $('input[name="unlock_token"]');
  if (unlockEl.length) {
    const unlockData = {
      pepper: $('input[name="pepper"]').val(),
      geo_unlock: $('input[name="geo_unlock"]').val(),
      salt: $('input[name="salt"]').val()
    };
    return Promise.reject({ logged: false, unlockToken: true, unlockData });
  }
  const welcomeBar = $('#toolbar span a.toolbar_welcome');
  if (welcomeBar.length) {
    return Promise.reject({ logged: false, recaptcha: false });
  }
  const toolbar = $('.toolbar_welcome strong a');
  if (!toolbar.length) return Promise.reject({ logged: false, recaptcha: false, error: 'page changed?' });

  const days = $('.toolbar_welcome').text().match(/in (\d*) days/);
  const username = $('.toolbar_welcome strong a').text();
  const logoutKey = $('.toolbar_disconnect').attr('href').split('key=')[1];

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

// when retrieving details of an user, it misses an unique uid necessary for logout
// this function helps in that
function retrieveUid (username, logoutKey) {
  return lvl.getAsync(`user:uid:${logoutKey}`)
    .catch(storage.NotFoundError, () => {
      return fetchUid(username, logoutKey);
    });
}

// fetchUid from AD
function fetchUid (username, logoutKey) {
  return storage
    .getCookies(username)
    .then(makeJar)
    .then(jar => {
      return rp({
        url: ad.torrent,
        jar: jar
      });
    })
    .then(pageBody => {
      const uid = pageBody.match(/name="uid" value="(.*)"/)[1];
      return lvl.putAsync(`user:uid:${logoutKey}`, uid).return(uid); // write uid back
    });
}

exports.login = parseLogin;
