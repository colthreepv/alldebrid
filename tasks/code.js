'use strict';

let // node
  util = require('util');

let gulp = require('gulp');
let // gulp tools
  gutil = require('gulp-util'),
  source = require('vinyl-source-stream');

let // external deps
  browserify = require('browserify'),
  watchify = require('watchify');

exports.watch = function (destDir) {
  return function watch (done) {
    let b = watchify(browserify({
      entries: ['./src/index.js'],
      noParse: [ // libreries without `require()`
        require.resolve('angular/angular.js'),
        require.resolve('angular-ui-router'),
        require.resolve('angular-hotkeys')
      ],
      fullPaths: true,
      debug: true
    }));

    function rebuild () {
      var startTime = Date.now();
      var stream = b.bundle()
        .on('error', gutil.log.bind(gutil, 'Browserify Error'))
        .pipe(source('bundle.js'))
        .pipe(gulp.dest(destDir));

      stream.on('end', function () {
        var elapsed = Date.now() - startTime;
        gutil.log(gutil.colors.magenta('Rebuild code'), util.format('%dms', elapsed));
      });

      return stream;
    }

    b.on('update', rebuild);
    return rebuild();
  };
};

exports.build = function (destDir) {
  return function (code) {
    let b = browserify({
      entries: ['./src/'],
      debug: false
    });

    return b.bundle()
      .pipe(source('bundle.js'))
      .pipe(gulp.dest(destDir));
  };
};
