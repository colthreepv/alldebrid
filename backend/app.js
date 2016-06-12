'use strict';
require('./globals');

const express = require('express');
const jsonParser = require('body-parser').json();

const promesso = require('promesso');
const api = require('./api');
const pages = require('./pages');

exports = module.exports = function (session, serve) {
  const app = express();

  app.use(jsonParser);

  app.use(session);
  app.get(/(\/build\/|\/public\/).*/, serve);

  app.post('/api/login', promesso(api.login));
  app.post('/api/unlock', promesso(api.unlock));
  app.post('/api/logout', promesso(api.logout));

  app.get('/api/torrent');
  app.put('/api/torrent'); // add
  app.post('/api/convert');

  app.get('/login', pages.login);
  app.get('*', pages.main);

  app.use(function (err, req, res, next) {
    if (err && err instanceof SyntaxError) console.log('SYNTAX ERROR!'); // very bad
    console.dir(err.stack);
    return res.sendStatus(500);
  });

  return app;
};
exports['@require'] = ['components/session', 'components/serve'];
