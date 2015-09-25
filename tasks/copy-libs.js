'use strict';

let // node stdlib
  path = require('path'),
  frontend = require(path.join(process.cwd(), 'frontend.json')),
  pkg = require(path.join(process.cwd(), 'package.json')),
  overrides = frontend.overrides,
  additional = frontend.additional;

let // gulp modules
  gulp = require('gulp'),
  rev = require('gulp-rev'),
  rename = require('gulp-rename');
  // gutil = require('gulp-util');

/**
 * frontend.json structure:
 *
 * {
 *   // overrides gets removed from package.dependencies
 *   "overrides": {
 *     "angular": "node_modules/angular/angular.js",
 *     "bootstrap": false <-- make copy-libs ignore this library
 *   },
 *   // additionals gets added to dependencies list
 *   "additional": {
 *     "bootstrap": "node_modules/bootstrap/dist/css/bootstrap.css"
 *   }
 * }
 *
 * Behaviour is:
 * 1) Read all package.dependencies
 * 2) find the library to copy (via require.resolve)
 * 3) add to a list
 * 4) filter out overrides
 * 5) add overrides back with customized paths
 * 6) add "additionals", with customized paths
 *
 */


module.exports = function (buildPath) {
  return function copyJsLibs () {
    // filter dependencies, leaving only the ones without overrides
    let deps = Object.keys(pkg.dependencies)
    .filter(function (lib) {
      return overrides[lib] === undefined;
    });
    let depPaths = deps.map(require.resolve);

    Object.keys(overrides).forEach(function (lib) {
      if (overrides[lib] === false) return;
      deps.push(lib);
      depPaths.push(path.resolve(process.cwd(), overrides[lib]));
    });

    Object.keys(additional).forEach(function (lib) {
      deps.push(lib);
      depPaths.push(path.resolve(process.cwd(), additional[lib]));
    });

    // gutil.log(libPaths);
    return gulp.src(depPaths)
      .pipe(rename(function (path) {
        // in case the override has a different name from the original lib
        // this single line does this:
        // "bootstrap": "somefile.js" ==> "bootstrap.js"
        path.basename = deps.shift();
        // gutil.log('copyLibs', path);
      }))
      .pipe(rev())
      .pipe(gulp.dest(path.join(buildPath, 'libs')));
  };
};
