'use strict';

let // node
  util = require('util'),
  path = require('path'),
  spawn = require('child_process').spawn;

let gulp = require('gulp');
let // gulp tools
  gutil = require('gulp-util'),
  source = require('vinyl-source-stream');

let // external deps
  browserify = require('browserify'),
  watchify = require('watchify');

function classicWatch (destDir) {
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
}

exports.watch = function (done) {
  spawn('node', ['node_modules/watchify/bin/cmd.js', 'src/index.js', '-d', '-v', '-o', 'build/bundle.js'], {
    cwd: path.resolve(__dirname, '..'),
    stdio: 'inherit'
  });
  done();
};
exports.watch2 = classicWatch;

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
