'use strict';
const path = require('path');

const config = {
  buildDir: path.join(__dirname, '..', 'build'),
  bundles: null, // placeholder
  bundleFile: '.bundles.json'
};
if (process.env.NODE_ENV === 'production') {
  config.bundles = require(path.join(config.buildDir, config.bundleFile));
} else {
  config.bundles = {
    vendor: 'libs.js',
    js: 'bundle.js'
  };
}

module.exports = config;
