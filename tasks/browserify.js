'use strict';

let // gulp
  gulp = require('gulp'),
  rev = require('gulp-rev'),
  revHash = require('./rev-hash'),
  buffer = require('gulp-buffer'),
  source = require('vinyl-source-stream');

let // external deps
  browserify = require('browserify');

let b = browserify({
  fullPaths: true,
  debug: true
});
b.transform('bulkify');
b.transform('browserify-shim');
b.transform('envify');
b.add('src/index.js');

function createBrowserify (destDir) {
  return function browserifyBuild () {

    return b.bundle()
      .pipe(source('bundle.js'))
      .pipe(buffer())
      .pipe(rev())
      .pipe(revHash())
      .pipe(gulp.dest(destDir));
  };
};
module.exports = createBrowserify;
