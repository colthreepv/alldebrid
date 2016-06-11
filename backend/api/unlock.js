'use strict';
const Joi = require('joi');
const XError = require('x-error');
const rp = require('request-promise');

const ad = require('../ad');
const parse = require('./parse');
const storage = require('../components/storage');
const lvl = storage.lvl;

const fs = require('fs');

function unlock (req) {
  const username = req.body.username;
  const unlock_token = req.body.unlock_token;
  const pepper = req.body.pepper;
  const geo_unlock = req.body.geo_unlock;
  const salt = req.body.salt;

  return storage.getCookies(username)
  .then(jar => rp({
    url: ad.register,
    qs: {
      action: 'unlock'
    },
    form: { unlock_token, pepper, geo_unlock, salt },
    jar
  }))
  .tap(page => fs.writeFileSync('unlock.html', page))
  .then(parse.login)
  .then(parse.userData)
  .catch(err => {
    throw new XError(1100).hr('unexpected error').hc(500).debug(err);
  })
  .then(login => lvl.putAsync(`user:${login.uid}:uid`, login.username).return(login))
  .then(login => {
    req.session.uid = login.uid;

    return { status: 'ok', redirect: '/' };
  });
}
unlock['@validation'] = {
  body: {
    username: Joi.string().required(),
    unlock_token: Joi.string().required(),
    pepper: Joi.string().required(),
    geo_unlock: Joi.string().required(),
    salt: Joi.string().required()
  }
};
module.exports = unlock;
