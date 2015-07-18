'use strict';

let // node stdlib
  path = require('path'),
  overrides = require(path.join(process.cwd(), 'frontend.json')).overrides,
  pkg = require(path.join(process.cwd(), 'package.json'));

let // gulp modules
  gulp = require('gulp'),
  rename = require('gulp-rename');
  // gutil = require('gulp-util');

module.exports = function (buildPath) {
  return function copyJsLibs () {
    let libExceptions = Object.keys(overrides);
    libExceptions.forEach(function (lib) { // filter bad libraries, like angular.js
      delete pkg.dependencies[lib];
    });

    let
      libArray = Object.keys(pkg.dependencies),
      libPaths = libArray.map(require.resolve);

    libExceptions.forEach(function (lib) {
      libArray.push(lib);
      libPaths.push(path.resolve(process.cwd(), overrides[lib]));
    });

    // gutil.log(libPaths);
    return gulp.src(libPaths)
      .pipe(rename(function (path) {
        path.basename = libArray.shift();
        // gutil.log('copyLibs', path);
      }))
      .pipe(gulp.dest(path.join(buildPath, 'libs')));
  };
};
