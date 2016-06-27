'use strict';
const Joi = require('joi');
const cheerio = require('cheerio');
const replyUser = require('./common-login').replyUser;

exports = module.exports = function (errorCodes, ad, parse, storage, rp) {
  const err = {
    respUnexpected: errorCodes.add(1100, 'unlock is not valid'),
    parseError: errorCodes.add(1101, 'presumably a parse error happened')
  };

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
      throw err.respUnexpected().hr('unexpected error').hc(500).debug(response);
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
        throw err.parseError().hr('unexpected error').hc(500).debug(err);
      })
      .then(login => replyUser(req, login));
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

  return unlock;
};
exports['@singleton'] = true;
exports['@require'] = [
  'components/error-codes',
  'ad',
  'util/parse-login',
  'components/storage',
  'components/request'
];
