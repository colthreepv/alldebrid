'use strict';
const Joi = require('joi');
const XError = require('x-error');
const cheerio = require('cheerio');

const ad = require('../ad');
const parse = require('./parse');
const storage = require('../components/storage');
const rp = require('../components/request');

function unlock (req) {
  const unlock_token = req.body.unlock_token;
  const pepper = req.body.pepper;
  const geo_unlock = req.body.geo_unlock;
  const salt = req.body.salt;
  const jar = rp.jar();

  return rp({
    method: 'POST',
    url: ad.register,
    qs: {
      action: 'unlock'
    },
    form: { unlock_token, pepper, geo_unlock, salt },
    jar,
    headers: { Host: 'alldebrid.com' }
  })
  .tap(response => console.log(response.headers['set-cookie']))
  .then(response => {
    const uid = parse.detectLogin(response.headers['set-cookie']);
    if (uid) return completeLogin(response, uid);
    // request might be non-jsonifiable
    throw new XError(1100).hr('unexpected error').hc(500).debug(response);
  });

  function completeLogin (response, uid) {
    return rp({
      url: response.headers.location,
      jar
    })
    .then(response => [cheerio.load(response.body), uid])
    .spread(parse.userData)
    .then(login => storage.setCookies(login.username, jar.getCookies(ad.base)).return(login))
    .catch(err => {
      throw new XError(1101).hr('unexpected error').hc(500).debug(err);
    })
    .then(login => {
      req.session.uid = login.uid;

      return { status: 'ok', redirect: `${req.protocol}://${req.headers.host}/` };
    });

  }

}
unlock['@validation'] = {
  body: {
    unlock_token: Joi.string().required(),
    pepper: Joi.string().required(),
    geo_unlock: Joi.string().required(),
    salt: Joi.string().required()
  }
};
module.exports = unlock;
