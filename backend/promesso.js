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
        response.forEach(r => res[r.method].apply(null, r.args));
      } else {
        res.status(200).send(response);
      }
    })
    .catch(XError, err => {
      console.log(`Error: ${ err.code } - ${ err.message }`);
      console.dir(err);

      const httpCode = err.httpCode || 500;
      const httpResponse = err.httpResponse;
      if (httpResponse) res.status(httpCode).send(httpResponse);
      else res.sendStatus(httpCode);
    });
  };
}

function isObject (obj) {
  return (obj !== null && typeof obj === 'object');
}

module.exports = promesso;
