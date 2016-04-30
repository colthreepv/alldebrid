'use strict';
const path = require('path');
const hook = require('css-modules-require-hook');
const sass = require('node-sass');
require('babel-register')({
  babelrc: false,
  presets: ['es2015', 'react'],
  only: 'shared'
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
const XError = require('x-error');

// client deps
const React = require('react');
const Provider = require('react-redux').Provider;
const renderToString = require('react-dom/server').renderToString;
const RouterContext = require('react-router').RouterContext;

// for server-side rendering
const match = Promise.promisify(require('react-router').match, { multiArgs: true });
const fetchComponentData = require('./util/fetchComponentData');

let routes = require('../shared/routes').default;

// inspiration from bananaoomarang/isomorphic-redux
function renderView (req) {
  const store = process.env.NODE_ENV === 'development' ?
    require('../shared/store.dev').default :
    require('../shared/store').default;

  // TODO: devo convertire match() a qualcosa che ritorna una promise https://github.com/reactjs/react-router/issues/1990
  return match({ routes, location: req.url })
  .catch((err) => { throw new XError(2001).m('match errored').hc(500).debug(err); })
  .spread((redirectLocation, renderProps) => templateView(store, redirectLocation, renderProps));
}

module.exports = renderView;

function templateView (store, redirectLocation, renderProps) {
  if (!renderProps) throw new XError(2000).m('Not Found').hc(404);
  console.log('renderProps');
  console.log(renderProps.components);
  console.log(renderProps.params);
  return fetchComponentData(store, renderProps).spread(templateHome);
}


function templateHome (store, renderProps) {
  const initialState = store.getState();
  console.log('initialState', initialState);

  const html = renderToString(
    React.createElement(Provider, { store },
      React.createElement(RouterContext, renderProps)
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
  watch(path.resolve(__dirname, '..', 'shared'), updateApp);
}

function updateApp () {
  delete require.cache[require.resolve('../shared/routes')];
  routes = require('../shared/routes').default;
  console.log('--- homepage: updated Routes');
}
