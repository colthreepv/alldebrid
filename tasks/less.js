'use strict';

let path = require('path');

let // gulp
  gulp = require('gulp'),
  rev = require('gulp-rev'),
  less = require('gulp-less');

function buildLess (destDir) {
  return function () {
    return gulp.src('css/*.less')
      .pipe(less({
        paths: [
          path.join(process.cwd(), 'node_modules')
        ]
      }))
      .pipe(rev())
      .pipe(gulp.dest(destDir))
      .pipe(rev.manifest({
        merge: true
      }))
      .pipe(gulp.dest(destDir));
  };
}

module.exports = buildLess;
