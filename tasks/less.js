'use strict';

let path = require('path');

let // gulp
  gulp = require('gulp'),
  less = require('gulp-less');

function buildLess (destDir) {
  return function () {
    return gulp.src('css/*.less')
      .pipe(less({
        paths: [
          path.join(process.cwd(), 'node_modules')
        ]
      }))
      .pipe(gulp.dest(destDir));
  };
}

module.exports = buildLess;
