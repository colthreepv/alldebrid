'use strict';

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
  if (headers == null) return null; // headers['set-cookie'] can be undefined

  // FIXME: unnecessary filter
  const uidHeader = headers.filter(header => header.startsWith('uid='));
  if (uidHeader.length) return uidHeader[0].match(/uid=(.*?);/)[1];
  return null;
}

exports.userData = parseUserData;
exports.detectLogin = detectLogin;
