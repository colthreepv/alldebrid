'use strict';
const Joi = require('joi');
const XError = require('x-error');
const rp = require('request-promise');

const ad = require('../ad');
const parse = require('./parse');
const storage = require('../components/storage');
const lvl = storage.lvl;

function unlock (req) {
  const username = req.body.username;
  const unlock_token = req.body.unlock_token;
  const pepper = req.body.pepper;
  const geo_unlock = req.body.geo_unlock;
  const salt = req.body.salt;
  const jar = rp.jar();

  return rp({
    url: ad.register,
    qs: {
      action: 'unlock',
      unlock_token, pepper, geo_unlock, salt
    },
    jar
  })
  .then(parse.login)
  .catch(login => {
    if (login.recaptcha) throw new XError(1100).hr('recaptcha appeared').hc(403);
    if (login.unlockToken) throw new XError(1101).hr(login.unlockData).hc(202);
    if (login.error) throw new XError(1102).hr(login.error).hc(412);
    throw new XError(1103).hr('invalid username/password').hc(401);
  })
  .then(login => storage.setCookies(username, jar.getCookies(ad.base)).return(login))
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
