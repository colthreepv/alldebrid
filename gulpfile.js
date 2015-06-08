'use strict';

let path = require('path');

let // gulp deps
  gulp = require('gulp'),
  less = require('gulp-less');

let // external deps
  del = require('del');

let destDir = 'build';
let tasks = require('./tasks');

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

gulp.task('html', function (done) {
  return gulp.src('./index.html')
    .pipe(gulp.dest(destDir));
});

gulp.task('code-build', tasks.code.build(destDir));
gulp.task('code-watch', tasks.code.watch);
gulp.task('clean', cleanDir);
gulp.task('less', buildLess);
gulp.task('default',
  gulp.series('clean',
    gulp.parallel('html', 'less', 'code-watch')
  )
);
