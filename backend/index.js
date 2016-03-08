'use strict';
const express = require('express');
const jsonParser = require('body-parser').json();
const promesso = require('./promesso');
const session = require('express-session');
const LevelStore = require('express-session-level')(session);
const sessionStorage = require('level')('session.db');
const api = require('./api');

const app = express();
app.use(jsonParser);

app.use(session({
  // merge with config.session
  store: new LevelStore(sessionStorage)
}));


app.post('/login', promesso(api.login));
app.post('/logout');

app.get('/api/torrent');
app.put('/api/torrent'); // add
app.post('/api/convert');

app.use(function (err, req, res, next) {
  res.status(400).json(err);
});

module.exports = app;

function listenCallback () {
  const address = this.address();
  console.log(`Server listening to http://${ address.address }:${ address.port }/`);
}

if (require.main === module) app.listen(3000, '127.0.0.1', listenCallback);
