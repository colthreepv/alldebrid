'use strict';
const path = require('path');
const express = require('express');
const jsonParser = require('body-parser').json();
const session = require('express-session');
const nunjucks = require('nunjucks');
const LevelStore = require('express-session-level')(session);
const sessionStorage = require('level')(path.join(__dirname, '..', 'session.db'));

const config = require(path.join(__dirname, '..', 'config.json'));
const promesso = require('./promesso');
const api = require('./api');
const controllers = require('./controllers');

const app = express();
const env = nunjucks.configure('views', {
  express: app,
  trimBlocks: true,
  watch: true,
  tags: { // custom tags to not collide with angular
    variableStart: '<<',
    variableEnd: '>>'
  }
});

env.express(app);
app.use(jsonParser);

const sessionConf = Object.assign({}, config.session, {
  store: new LevelStore(sessionStorage)
});
app.use(session(sessionConf));

app.post('/login', promesso(api.login));
app.post('/logout', promesso(api.logout));

app.get('/api/torrent');
app.put('/api/torrent'); // add
app.post('/api/convert');

app.get('/', promesso(controllers.home));

app.use(function (err, req, res, next) {
  if (err && err instanceof SyntaxError) console.log('SYNTAX ERROR!'); // very bad
  console.log(err);
  console.dir(err);
  return res.sendStatus(500);
});

module.exports = app;

function listenCallback () {
  const address = this.address();
  console.log(`Server listening to http://${ address.address }:${ address.port }/`);
}

if (require.main === module) app.listen(3000, '127.0.0.1', listenCallback);
