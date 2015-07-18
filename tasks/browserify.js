'use strict';

let // node
  util = require('util');

let // gulp
  gulp = require('gulp'),
  gutil = require('gulp-util'),
  source = require('vinyl-source-stream');

let // external deps
  browserify = require('browserify'),
  watchify = require('watchify');

let b = browserify({
  fullPaths: true,
  debug: true
});
b.transform('bulkify');
b.transform('browserify-shim');
b.add('src/index.js');

exports.watch = function (destDir) {
  return function browserifyWatch (done) {
    let w = watchify(b);

    function rebuild () {
      var startTime = Date.now();
      var stream = w.bundle()
        .on('error', gutil.log.bind(gutil, 'Browserify Error'))
        .pipe(source('bundle.js'))
        .pipe(gulp.dest(destDir));

      stream.on('end', function () {
        var elapsed = Date.now() - startTime;
        gutil.log(gutil.colors.magenta('Rebuild code'), util.format('%dms', elapsed));
      });

      return stream;
    }

    w.on('update', rebuild);
    return rebuild();
  };
};

exports.build = function (destDir) {
  return function browserifyBuild () {

    return b.bundle()
      .pipe(source('bundle.js'))
      .pipe(gulp.dest(destDir));
  };
};
