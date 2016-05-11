'use strict';
const config = require('../config');
const isProd = process.env.NODE_ENV === 'production';

const CODE_DIR = config.sharedCode;

let isWatching = false;
let App = require(CODE_DIR).default;

function loadApp () {
  if (!isProd) {
    const watch = require('node-watch');
    if (!isWatching) watch(CODE_DIR, updateApp);
    isWatching = true;
  }

  function updateApp () {
    delete require.cache[require.resolve(CODE_DIR)];
    App = require(CODE_DIR).default;
    console.log('--- loadApp: reloaded code');
  }

  return App;
}

module.exports = loadApp;
