'use strict';
const hook = require('css-modules-require-hook');
const sass = require('node-sass');

const nodeModules = require('../config').nodeModules;
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
    includePaths: [nodeModules]
  }).css
});
