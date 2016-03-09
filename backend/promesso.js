'use strict';

const validation = require('express-validation');
const XError = require('x-error');

function promesso (handler) {
  const middlewares = [];
  if (isObject(handler['@before'])) middlewares.push(handler['@before']);
  if (isObject(handler['@validation'])) middlewares.push(validation(handler['@validation']));

  if (handler['@type'] === 'raw') middlewares.push(handler);
  else middlewares.push(handleFactory(handler));

  return middlewares;
}

function handleFactory (handler) {

  // handle more cases
  return function (req, res) {
    handler(req, res)
    .then(response => {
      if (Array.isArray(response)) { // array structure
        response.forEach(r => res[r.method].apply(res, r.args));
      } else {
        if (isObject(response)) res[response.method].apply(res, response.args);
        else res.status(200).send(response);
      }
    })
    .catch(XError, err => {
      console.log(`Error: ${ err.code } - ${ err.message }`);
      console.dir(err);

      const httpCode = err.httpCode || 500;
      const httpResponse = err.httpResponse;
      if (httpResponse) res.status(httpCode).send(httpResponse);
      else res.sendStatus(httpCode);
    })
    .catch(Error, err => {
      console.dir(err, 'coding error', { body: req.body, query: req.query, params: req.params, ip: req.ip, status: 500 });
      // if (page) return res.status(500).render('error');
      return res.sendStatus(500);
    })
    .catch(err => {
      console.error('Non-Error Error, probably string:');
      console.error(err);
      return res.sendStatus(500);
    });
  };
}

function isObject (obj) {
  return (obj !== null && typeof obj === 'object');
}

module.exports = promesso;
