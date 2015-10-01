'use strict';

let // gulp
  gulp = require('gulp'),
  buffer = require('gulp-buffer'),
  gulpif = require('gulp-if'),
  rev = require('gulp-rev'),
  revHash = require('./rev-hash'),
  source = require('vinyl-source-stream'),
  sourcemaps = require('gulp-sourcemaps'),
  uglify = require('gulp-uglify');

let // external deps
  browserify = require('browserify');

let b = browserify({
  debug: true
});
b.transform('bulkify');
b.transform('browserify-shim');
b.transform('envify');
b.add('src/index.js');

function createBrowserify (destDir, production) {
  return function browserifyBuild () {

    return b.bundle()
      .pipe(source('bundle.js'))
      .pipe(buffer())
        .pipe(gulpif(production, sourcemaps.init({loadMaps: true})))
        .pipe(gulpif(production, uglify()))
      .pipe(rev())
      .pipe(revHash())
        .pipe(gulpif(production, sourcemaps.write('./')))
      .pipe(gulp.dest(destDir));
  };
};
module.exports = createBrowserify;
