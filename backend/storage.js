'use strict';
const Redis = require('ioredis');
const redis = new Redis();

function getCookies (username) {
  return redis.get(`user:${ username }:cookies`).then(data => JSON.parse(data));
}

function setCookies (username, data) {
  return redis.set(`user:${ username }:cookies`, JSON.stringify(data));
}

function clearCookies (username) {
  return redis.del(`user:${ username }:cookies`);
}

module.exports = {
  getCookies,
  setCookies,
  clearCookies,
  redis
};
