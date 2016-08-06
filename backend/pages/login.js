'use strict';
const APP_NAME = 'login';

const bundles = rootRequire('./config').bundles;
const analyze = rootRequire('./util/analyze-login');

function login (req) {
  return analyze().then(page);
}

function page (initialState) {
  const recaptchaScript = initialState.recaptcha ?
    `<script src="${initialState.recaptcha}"></script>` : '';

  return `
  <!doctype html>
  <html ng-app="${APP_NAME}" ng-strict-di lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>AllDebrid Better Frontend</title>
    <meta name="description" content="">
    <link rel="shortcut icon" type="image/x-icon" href="//cdn.alldebrid.com/lib/images/default/favicon.png">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="${bundles.style}">
    <base href="/">
  </head>
  <body>
    <div id="container" ui-view></div>
    <script>window.STATE_FROM_SERVER = ${JSON.stringify(initialState)}</script>
    <script src="${bundles.vendor}"></script>
    <script src="${bundles[APP_NAME]}"></script>
    ${recaptchaScript}
  </body>
  </html>`;

}

module.exports = login;
