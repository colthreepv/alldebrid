'use strict';
const path = require('path');
const assign = require('assign-deep');
const privateConf = require('../config.json');

const DEV_SERVER = '//localhost:8080/build';

const config = {
  // shared code paths
  apps: {
    main: path.resolve(__dirname, '../shared/apps/main/'),
    login: path.resolve(__dirname, '../shared/apps/login/')
  },
  nodeModules: path.resolve(__dirname, '..', 'node_modules'),

  buildDir: path.join(__dirname, '..', 'build'),
  bundles: null, // placeholder
  bundleFile: '.bundles.json',

  domain: null, // from private config

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
  config.bundles = require(path.join(config.buildDir, config.bundleFile));
} else {
  config.bundles = {
    vendor: `${DEV_SERVER}/vendor.js`,
    main: `${DEV_SERVER}/main.js`,
    login: `${DEV_SERVER}/login.js`
  };
}

module.exports = assign({}, config, privateConf);
