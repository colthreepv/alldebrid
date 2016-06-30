'use strict';
const path = require('path');
const assign = require('assign-deep');
const privateConf = require('../config.json');

const BASE_DIR = '/build';

const config = {
  rootDir: path.join(__dirname, '..'),
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
    vendor: `${BASE_DIR}/${assets.vendor}`,
    style: `${BASE_DIR}/${assets.style}`,
    main: `${BASE_DIR}/${assets.main}`,
    login: `${BASE_DIR}/${assets.login}`
  };
} else {
  config.bundles = {
    vendor: `${BASE_DIR}/vendor.js`,
    style: `${BASE_DIR}/style.css`,
    main: `${BASE_DIR}/main.js`,
    login: `${BASE_DIR}/login.js`
  };
}

module.exports = assign({}, config, privateConf);
