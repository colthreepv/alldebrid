'use strict';
const Joi = require('joi');
const cheerio = require('cheerio');

// debug-only
function dumpLogin (response) {
  const fs = require('fs');
  fs.writeFileSync('login.html', response.body);
}

exports = module.exports = function (errorCodes, ad, parse, storage, rp) {
  const err = {
    invalidCredentials: errorCodes.add(1000, 'user/pass combination invalid'),
    recaptchaAppeared: errorCodes.add(1002, 'recaptcha appeared'),
    parseError: errorCodes.add(1003, 'unexpected login error, maybe page change?')
  };

  // sets a cookie - via express-session
  function login (req) {
    const username = req.body.username;
    const password = req.body.password;
    const jar = rp.jar();

    return rp({
      url: ad.register,
      qs: {
        action: 'login',
        'login_login': username,
        'login_password': password
      },
      followRedirect: false,
      jar
    })
    .then(response => {
      const uid = parse.detectLogin(response.headers['set-cookie']);
      if (uid) return completeLogin(response.headers.location, uid);
      // try to understand which error happened
      return detectError(response);
    });


    // promise.chain terminator in case Login is succesful
    function completeLogin (url, uid) {
      return rp({ url, jar })
      .then(response => cheerio.load(response.body))
      .then($ => parse.userData($, uid))
      .then(login => storage.setCookies(username, jar.getCookies(ad.base)).return(login))
      .then(login => {
        req.session.uid = login.uid;
        req.session.username = login.username;

        return { status: 'ok', redirect: `${req.protocol}://${req.headers.host}/` };
      });
    }

    // promise-chain terminator in case of alldebrid requests for user intervention to unlock
    function unlockRequest (loginObject) {
      const response = loginObject.unlockData;
      return [
        { method: 'status', args: [202] },
        { method: 'send', args: [response] }
      ];
    }

    function detectError (response) {
      const login = parse.loginError(cheerio.load(response.body));
      if (login.unlockToken) return unlockRequest(login);
      if (login.recaptcha) throw err.recaptchaAppeared().hr('recaptcha appeared').hc(403);
      if (login.error) throw err.parseError.hr(login.error).hc(412);
      throw err.invalidCredentials().hc(401).debug(login);
    }
  }
  login['@validation'] = {
    body: {
      username: Joi.string().required(),
      password: Joi.string().required()
    }
  };

  return login;
};
exports['@singleton'] = true;
exports['@require'] = [
  'components/error-codes',
  'ad',
  'util/parse-login',
  'components/storage',
  'components/request'
];
