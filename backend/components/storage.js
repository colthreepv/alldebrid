'use strict';
const path = require('path');

const Promise = require('bluebird');
const levelup = require('levelup');
const ttl = require('level-ttl');
const lvlVanilla = levelup(path.join(__dirname, '..', '..', 'level.db'));
const lvl = ttl(lvlVanilla);

Promise.promisifyAll(lvl);

function getCookies (username) {
  return lvl.getAsync(`user:${username}:cookies`).then(data => JSON.parse(data));
}

function setCookies (username, cookies) {
  const stringCookies = cookies.map(c => c.toString());
  return lvl.putAsync(`user:${username}:cookies`, JSON.stringify(stringCookies));
}

function clearCookies (username) {
  return lvl.delAsync(`user:${username}:cookies`);
}

function getTorrents (username) {
  return lvl.getAsync(`user:${username}:torrents`).then(data => JSON.parse(data));
}

function setTorrents (username, torrents) {
  return lvl.putAsync(`user:${username}:torrents`, JSON.stringify(torrents));
}

function NotFoundError (err) {
  return err.notFound;
}

module.exports = {
  getCookies,
  setCookies,
  clearCookies,
  lvl,
  NotFoundError,
  getTorrents,
  setTorrents
};
