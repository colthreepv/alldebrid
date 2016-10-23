'use strict';
const path = require('path');
const assign = require('assign-deep');
const privateConf = require('../config.json');

const BASE_DIR = '/build';

const config = {
  rootDir: path.join(__dirname, '..'),
  buildDir: path.join(__dirname, '..', 'build'),
  bundles: null, // placeholder
  bundleFile: '.bundles.json',

  domain: null, // from private config

  dbStorage: path.join(__dirname, '..', 'level.db'),

  session: {
    secret: null, // from private config
    name: null, // from private config
    resave: false,
    rolling: true,
    saveUninitialized: false
  },
  sessionStorage: path.join(__dirname, '..', 'session.db')
};

// bundles replace
if (process.env.NODE_ENV === 'production') {
  const assets = require(path.join(config.buildDir, config.bundleFile));
  config.bundles = {
    js: {
      main: `${BASE_DIR}/${assets.js.main}`,
      login: `${BASE_DIR}/${assets.js.login}`,
      common: `${BASE_DIR}/${assets.js.common}`,
    },
    css: {
      main: `${BASE_DIR}/${assets.css.main}`,
      common: `${BASE_DIR}/${assets.css.common}`,
    }
  };
} else {
  config.bundles = {
    js: {
      main: `${BASE_DIR}/main.js`,
      login: `${BASE_DIR}/login.js`,
      common: `${BASE_DIR}/common.js`,
    },
    css: {
      main: `${BASE_DIR}/main.css`,
      common: `${BASE_DIR}/common.css`,
    }
  };
}

module.exports = assign({}, config, privateConf);
