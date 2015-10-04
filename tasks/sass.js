'use strict';

let path = require('path');

let // gulp
  gulp = require('gulp'),
  rev = require('gulp-rev'),
  revHash = require('./rev-hash'),
  sass = require('gulp-sass');

function createSassBuilder (destDir) {
  return function sassBuilder () {
    return gulp.src('css/style.scss')
      .pipe(sass({
        includePaths: [
          path.join(process.cwd(), 'node_modules')
        ]
      }))
      .pipe(rev())
      .pipe(revHash())
      .pipe(gulp.dest(destDir));
  };
}

module.exports = createSassBuilder;
