'use strict';
require('./_init'); // babel & css
const bundles = require('../config').bundles;

// server deps
const createState = require('../util/create-state');
const loadApp = require('../util/load-app');

// client deps
const React = require('react');
const Provider = require('react-redux').Provider;
const renderToString = require('react-dom/server').renderToString;

// inspiration from bananaoomarang/isomorphic-redux
function renderView (req) {
  const createStore = process.env.NODE_ENV === 'development' ?
    require('../../shared/store.dev').default :
    require('../../shared/store').default;

  const initialState = createState(req.session);
  const store = createStore(initialState);

  return template(store);
}

module.exports = renderView;

function template (store) {
  const App = loadApp();
  const initialState = store.getState();
  console.log('initialState', initialState);

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
