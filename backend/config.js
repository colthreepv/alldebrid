'use strict';
const path = require('path');
const assign = require('assign-deep');
const privateConf = require('../config.json');

const DEV_SERVER = '//localhost:8080/build';

const config = {
  // shared code paths
  sharedCode: path.resolve(__dirname, '../shared/apps/main/'),
  nodeModules: path.resolve(__dirname, '..', 'node_modules'),

  buildDir: path.join(__dirname, '..', 'build'),
  bundles: null, // placeholder
  bundleFile: '.bundles.json',

  domain: null, // placeholder

  session: {
    secret: null, // placeholder
    name: null, // placeholder
    resave: false,
    rolling: true,
    saveUninitialized: false
  },
  sessionStorage: path.join(__dirname, '..', 'session.db')
};

// bundles replace
if (process.env.NODE_ENV === 'production') {
  config.bundles = require(path.join(config.buildDir, config.bundleFile));
} else {
  config.bundles = {
    vendor: `${DEV_SERVER}/libs.js`,
    js: `${DEV_SERVER}/bundle.js`
  };
}

module.exports = assign({}, config, privateConf);
