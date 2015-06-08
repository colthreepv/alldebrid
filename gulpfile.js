'use strict';

let path = require('path');

let // gulp deps
  gulp = require('gulp'),
  less = require('gulp-less');

let // external deps
  del = require('del');

let destDir = 'build';

function cleanDir (done) {
  del(destDir, done);
}

function buildLess (done) {
  return gulp.src('css/*.less').pipe(less({
    paths: [
      path.join(__dirname, 'node_modules', 'bootstrap/less'),
      path.join(__dirname, 'node_modules', 'angular/'),
      path.join(__dirname, 'css')
    ]
  })).pipe(gulp.dest(destDir));
}

gulp.task('clean', cleanDir);
gulp.task('less', buildLess);
gulp.task('default', gulp.series('clean', 'less'));
