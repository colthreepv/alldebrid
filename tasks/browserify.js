'use strict';

let // gulp
  gulp = require('gulp'),
  source = require('vinyl-source-stream');

let // external deps
  browserify = require('browserify');

let b = browserify({
  fullPaths: true,
  debug: true
});
b.transform('bulkify');
b.transform('browserify-shim');
b.add('src/index.js');

exports.build = function (destDir) {
  return function browserifyBuild () {

    return b.bundle()
      .pipe(source('bundle.js'))
      .pipe(gulp.dest(destDir));
  };
};
