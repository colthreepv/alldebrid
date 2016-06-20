'use strict';

/**
 * FIXME
 * loginError parse alldebrid.com main page, to understand if a Login succeded
 * @param  {string} pageBody [description]
 * @return {object}          cheerio.js instance of the page
 */
function loginError ($) {
  const recaptcha = $('.login textarea[name="recaptcha_challenge_field"]');
  if (recaptcha.length) {
    // A wild recaptcha appears
    return { logged: false, recaptcha: true };
  }

  const unlockEl = $('input[name="unlock_token"]');
  if (unlockEl.length) {
    const unlockData = {
      pepper: $('input[name="pepper"]').val(),
      geo_unlock: $('input[name="geo_unlock"]').val(),
      salt: $('input[name="salt"]').val()
    };
    return { logged: false, unlockToken: true, unlockData };
  }

  const welcomeBar = $('#toolbar span a.toolbar_welcome');
  if (welcomeBar.length) {
    return { logged: false, recaptcha: false };
  }

  return { logged: false, recaptcha: false, error: 'page changed?' };
}

/**
 * parseUserData parses main page, once a Login succeded, to parse user informations
 * @param  {object} $ cheerio.js instance of main page
 * @return {object}   hash describing user informations
 */
function parseUserData ($, uid) {
  const days = $('.toolbar_welcome').text().match(/in (\d*) days/);
  const username = $('.toolbar_welcome strong a').text();
  const logoutKey = $('.toolbar_disconnect').attr('href').split('key=')[1];

  // retrieve user UID and give back to user
  return {
    uid,
    logged: true,
    username,
    remainingDays: days ? parseInt(days[1], 10) : 0,
    logoutKey
  };
}

// in case alldebrid answers with an header containing the user uid
// it means the user is logged in successfully
// uid format: a3fa24190140ec2291817c22
function detectLogin (headers) {
  if (headers == null) return false; // headers['set-cookie'] can be undefined

  const uidHeader = headers.filter(header => header.startsWith('uid='));
  if (uidHeader.length) return uidHeader[0].match(/uid=(.*?);/)[1];
  return false;
}

exports.loginError = loginError;
exports.userData = parseUserData;
exports.detectLogin = detectLogin;
