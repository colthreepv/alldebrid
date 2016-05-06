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
