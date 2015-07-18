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

let b = browserify({
    noParse: [ // in these libraries there are no `require()s`
      require.resolve('angular/angular.js'),
      require.resolve('angular-ui-router'),
      require.resolve('angular-hotkeys')
    ],
    fullPaths: true,
    debug: true
  });
b.transform('bulkify');
b.add('src/index.js');

exports.watch = function (destDir) {
  return function watch (done) {
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

if (module === module.main) {
  let path = require('path');
  console.log('manually starting build');
  exports.build(path.join(process.cwd(), 'build'));
}
