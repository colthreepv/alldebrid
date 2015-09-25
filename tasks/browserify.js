'use strict';

let // gulp
  gulp = require('gulp'),
  rev = require('gulp-rev'),
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
      .pipe(gulp.dest(destDir))
      .pipe(rev.manifest({
        merge: true
      }))
      .pipe(gulp.dest(destDir));
  };
};
module.exports = createBrowserify;
