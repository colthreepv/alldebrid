'use strict';
const express = require('express');
const jsonParser = require('body-parser').json();

const promesso = require('promesso');
const api = require('./api');
const controllers = require('./controllers');
const homepage = require('./homepage');
const session = require('./components/session');
const serveStatic = require('./components/serve-static');

const isProd = process.env.NODE_ENV === 'production';
const app = express();

app.use(jsonParser);

app.use(session);

if (!isProd) {
  const webpack = require('webpack');
  const webpackMiddleware = require('webpack-dev-middleware');
  const webpackConfig = require('../webpack.config');
  app.use(webpackMiddleware(webpack(webpackConfig), {
    publicPath: '/build/'
  }));
} else {
  app.get('/build/*', serveStatic);
}

app.post('/login', promesso(api.login));
app.post('/logout', promesso(api.logout));

app.get('/api/torrent');
app.put('/api/torrent'); // add
app.post('/api/convert');

app.get('/', promesso(homepage));

app.use(function (err, req, res, next) {
  if (err && err instanceof SyntaxError) console.log('SYNTAX ERROR!'); // very bad
  console.log(err);
  console.dir(err);
  return res.sendStatus(500);
});

module.exports = app;

function listenCallback () {
  const address = this.address();
  console.log(`Server listening to http://${address.address}:${address.port}/`);
}

if (require.main === module) app.listen(3000, '127.0.0.1', listenCallback);
