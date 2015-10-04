'use strict';

let path = require('path');

let // gulp
  gulp = require('gulp'),
  gulpif = require('gulp-if'),
  rev = require('gulp-rev'),
  revHash = require('./rev-hash'),
  sass = require('gulp-sass'),
  sourcemaps = require('gulp-sourcemaps');

function buildLess (destDir, production) {
  return function () {
    return gulp.src('css/style.scss')
      .pipe(sourcemaps.init())
      .pipe(sass({
        includePaths: [
          path.join(process.cwd(), 'node_modules')
        ]
      }))
      .pipe(rev())
      .pipe(revHash())
        .pipe(gulpif(production, sourcemaps.write('.')))
      .pipe(gulpif(!production, sourcemaps.write()))
      .pipe(gulp.dest(destDir));
  };
}

module.exports = buildLess;
