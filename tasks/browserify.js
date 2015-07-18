'use strict';

let // node
  path = require('path'),
  util = require('util');

let // gulp
  gulp = require('gulp'),
  gutil = require('gulp-util'),
  source = require('vinyl-source-stream');

let // external deps
  browserify = require('browserify'),
  watchify = require('watchify');

let pkg = require(path.join(process.cwd(), 'package.json'));

// avoids to include libraries already copied inside destination dir
let noResolve = Object.keys(pkg.dependencies).map(function (dep) {
  return require.resolve(dep);
});

let b = browserify({
  noParse: noResolve,
  fullPaths: true,
  debug: true
});
b.transform('bulkify');
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
  return function () {

    return b.bundle()
      .pipe(source('bundle.js'))
      .pipe(gulp.dest(destDir));
  };
};
