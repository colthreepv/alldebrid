'use strict';

let // node
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
      debug: true
    }));

    b.on('update', function () {
      console.time('update');
      b.bundle();
      console.timeEnd('update');
    });

    var stream = b.bundle()
      .pipe(source('bundle.js'))
      .pipe(gulp.dest(destDir));

    stream.on('end', function () {
      gutil.log(gutil.colors.magenta('Watching'), 'Code');
    });

    return stream;
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
