'use strict';
const path = require('path');
const hook = require('css-modules-require-hook');
const sass = require('node-sass');
require('babel-register')({
  babelrc: false,
  presets: ['es2015', 'react'],
  only: 'src'
});
hook({
  extensions: [ '.scss', '.css' ],
  preprocessCss: (data, filename) => sass.renderSync({
    data,
    file: filename,
    includePaths: [path.join(__dirname, '..', 'node_modules')]
  }).css
});
const bundles = require('./config').bundles;
const Promise = require('bluebird');

// client deps
const React = require('react');
const createStore = require('redux').createStore;
const Provider = require('react-redux').Provider;
const renderToString = require('react-dom/server').renderToString;
const push = require('react-router-redux').push;
let App = require('../src/app').default;
let reducers = require('../src/reducers').default;

function homepage (req) {
  const initialState = Promise.resolve(require('./initial-state')); // initial state loaded from file
  return Promise.join(initialState, req.url).spread(templateHome);
}

module.exports = homepage;

function templateHome (initialState, url) {
  const store = createStore(reducers, initialState);
  console.log('store', store.getState());
  const html = renderToString(
    React.createElement(Provider, { store },
      React.createElement(App)
    )
  );

  return `
  <!doctype html>
  <html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>AllDebrid Better Frontend</title>
    <meta name="description" content="">
    <link rel="shortcut icon" type="image/x-icon" href="//cdn.alldebrid.com/lib/images/default/favicon.png">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- <link rel="stylesheet" href="/<< rev['style.css'] >>"> -->
  </head>
  <body>
    <div id="container">${html}</div>
    <script>window.STATE_FROM_SERVER = ${JSON.stringify(initialState)}</script>
    <script src="${bundles.vendor}"></script>
    <script src="${bundles.js}"></script>
  </body>
  </html>`;
}

const isProd = process.env.NODE_ENV === 'production';

if (!isProd) {
  const watch = require('node-watch');
  watch(path.resolve(__dirname, '..', 'src'), updateApp);
}

function updateApp () {
  delete require.cache[require.resolve('../src/app')];
  delete require.cache[require.resolve('../src/reducers')];
  App = require('../src/app').default;
  reducers = require('../src/reducers').default;
  console.log('--- homepage: updated App');
}
