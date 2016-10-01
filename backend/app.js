'use strict';
require('./globals');

const express = require('express');
const jsonParser = require('body-parser').json();
const promesso = require('promesso');
const morgan = require('morgan');

const session = rootRequire('./components/session');
const serve = rootRequire('./components/serve');
const pages = rootRequire('./pages');
const api = rootRequire('./api');
const actions = rootRequire('./actions');

const app = express();

if (process.env.NODE_ENV === 'production') app.set('trust proxy', true);
app.use(jsonParser);
app.use(morgan('combined'));

app.use(session);
app.get(/(\/build\/|\/public\/).*/, serve);

app.post('/api/login', promesso(api.login));
app.post('/api/unlock', promesso(api.unlock));
app.post('/api/logout', promesso(api.logout));

app.get('/api/torrents', promesso(api.torrents));
app.post('/api/torrents', promesso(api.addTorrents));
app.post('/api/torrents/remove', promesso(api.removeTorrents));
app.post('/api/unrestrict', promesso(api.unrestrict));

app.get('/ad/', promesso(pages.adLogin));
app.post('/ad/unlock', promesso(pages.adUnlock));
app.post('/ad/', promesso(pages.adIntercept));

app.get('/add/*', promesso(actions.add));

app.get('/login', promesso(pages.login));
app.get('*', promesso(pages.main));

app.use(function (err, req, res, next) {
  if (err && err instanceof SyntaxError) console.log('SYNTAX ERROR!'); // very bad
  console.dir(err.stack);
  return res.sendStatus(500);
});

module.exports = app;
