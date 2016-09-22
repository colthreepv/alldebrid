'use strict';
const Joi = require('joi');
const cheerio = require('cheerio');

const ad = rootRequire('./ad');
const parse = rootRequire('./util/parse-login');
const rp = rootRequire('./components/request');
const storage = rootRequire('./components/storage');

function unlock (form) {
  const jar = rp.jar();

  return rp({
    method: 'POST',
    url: ad.register,
    qs: {
      action: 'unlock'
    },
    form,
    jar,
    headers: { Host: 'alldebrid.com' }
  })
  .tap(response => console.log(response.headers['set-cookie']))
  .then(response => {
    const uid = parse.detectLogin(response.headers['set-cookie']);
    if (uid) return completeLogin(response, uid);
    // request might be non-jsonifiable
    return Promise.reject(cheerio.load(response.body));
    // throw err.respUnexpected().hr('unexpected error').hc(500).debug(response);
  });

  function completeLogin (response, uid) {
    return rp({
      url: response.headers.location,
      jar
    })
    .then(response => [cheerio.load(response.body), uid])
    .spread(parse.userData)
    .then(login => storage.setCookies(login.username, jar.getCookies(ad.base)).return(login));
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
