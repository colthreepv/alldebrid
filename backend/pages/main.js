'use strict';
const bundles = require('../config').bundles;
const createState = require('../util/create-state');

module.exports = template;

function template (req) {
  const initialState = createState(req.session);

  return `
  <!doctype html>
  <html ng-app="main" lang="en">
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
    <div id="container"></div>
    <script>window.STATE_FROM_SERVER = ${JSON.stringify(initialState)}</script>
    <script src="${bundles.vendor}"></script>
    <script src="${bundles.main}"></script>
  </body>
  </html>`;
}
