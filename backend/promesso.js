'use strict';

const validation = require('express-validation');
const XError = require('x-error');
const Promise = require('bluebird');

function promesso (handler) {
  const middlewares = [];
  const befores = handler['@before'];
  if (isObject(befores)) befores.forEach(m => middlewares.push(middleFactory(m)));
  if (isObject(handler['@validation'])) middlewares.push(validation(handler['@validation']));

  if (handler['@type'] === 'raw') middlewares.push(handler);
  else middlewares.push(handleFactory(handler));

  return middlewares;
}

function handleFactory (handler) {

  // handle more cases
  return function (req, res) {
    const promisified = Promise.method(handler);
    promisified(req)
    .then(response => {
      if (Array.isArray(response)) { // array structure
        response.forEach(r => res[r.method].apply(res, r.args));
      } else {
        res.status(200).send(response);
      }
    })
    .catch(XError, xerrorHandler.bind(null, res))
    .catch(Error, errorHandler.bind(null, req, res))
    .catch(genericHandler.bind(null, res));
  };
}

function middleFactory (handler) {
  return function (req, res, next) {
    const promisified = Promise.method(handler);
    promisified(req)
      .then(() => {
        next();
      })
      .catch(XError, xerrorHandler.bind(null, res))
      .catch(Error, errorHandler.bind(null, req, res))
      .catch(genericHandler.bind(null, res));
  };
}

function isObject (obj) {
  return (obj !== null && typeof obj === 'object');
}

/**
 * Error Handlers
 */
function xerrorHandler (res, err) {
  console.log(`Error: ${ err.code } - ${ err.message }`);
  console.dir(err);

  const httpCode = err.httpCode || 500;
  const httpResponse = err.httpResponse;
  if (httpResponse) res.status(httpCode).send(httpResponse);
  else res.sendStatus(httpCode);
}
function errorHandler (req, res, err) {
  console.dir(err, 'coding error', { body: req.body, query: req.query, params: req.params, ip: req.ip, status: 500 });
  // if (page) return res.status(500).render('error');
  return res.sendStatus(500);
}
function genericHandler (res, err) {
  console.error('Non-Error Error, probably string:');
  console.error(err);
  return res.sendStatus(500);
}

module.exports = promesso;
