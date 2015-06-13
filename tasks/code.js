'use strict';

let // node
  path = require('path'),
  spawn = require('child_process').spawn;

let gulp = require('gulp');
let // gulp tools
  source = require('vinyl-source-stream');

let // external deps
  browserify = require('browserify'),
  watchify = require('watchify');

function classicWatch (destDir) {
  return function watch (done) {
    let b = watchify(browserify({
      entries: ['./src/'],
      debug: true
    }));

    b.on('update', function () {
      b.bundle();
      console.info('file changed!');
    });

    return b.bundle()
      .pipe(source('app.js'))
      .pipe(gulp.dest(destDir));
  };
}

exports.watch = function (done) {
  spawn('node', ['node_modules/watchify/bin/cmd.js', 'src/index.js', '-d', '-v', '-o', 'build/bundle.js'], {
    cwd: path.resolve(__dirname, '..'),
    stdio: 'inherit'
  });
  done();
};

exports.build = function (destDir) {
  return function (code) {
    let b = browserify({
      entries: ['./src/'],
      debug: true
    });

    return b.bundle()
      .pipe(source('app.js'))
      .pipe(gulp.dest(destDir));
  };
};
