'use strict';
const express = require('express');
const jsonParser = require('body-parser').json();

const promesso = require('promesso');
const api = require('./api');
const pages = require('./pages');
const session = require('./components/session');
const serve = require('./components/serve');

const listenPort = process.env.PORT || 8000;

const app = express();

app.use(jsonParser);

app.use(session);
app.get(/(\/build\/|\/public\/).*/, serve);

app.post('/api/login', promesso(api.login));
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

module.exports = app;

function listenCallback () {
  const address = this.address();
  console.log(`Backend server started at http://${address.address}:${address.port}/`);
}

if (require.main === module) app.listen(listenPort, '127.0.0.1', listenCallback);
