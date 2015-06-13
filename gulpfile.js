'use strict';

let path = require('path');

let // gulp deps
  gulp = require('gulp'),
  less = require('gulp-less');

let // external deps
  del = require('del');

let destDir = 'build';
let tasks = require('./tasks');

let staticList = [
  'icon_128.png',
  'icon_48.png',
  'main.js',
  'index.html',
  'manifest.json',
  'index.html'
];

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

gulp.task('copy-static', function () {
  return gulp.src(staticList).pipe(gulp.dest(destDir));
});

gulp.task('static-watch', function (done) {
  gulp.watch(staticList, gulp.series('copy-static'));
  done();
});

gulp.task('copy-fonts', function () {
  return gulp.src([
    'node_modules/bootstrap/fonts/glyphicons-halflings-regular.woff',
    'node_modules/bootstrap/fonts/glyphicons-halflings-regular.woff2',
    'node_modules/bootstrap/fonts/glyphicons-halflings-regular.ttf'
  ]).pipe(gulp.dest(path.join(destDir, 'fonts')));
});

gulp.task('code-build', tasks.code.build(destDir));
gulp.task('code-watch', tasks.code.watch);
gulp.task('clean', cleanDir);
gulp.task('less', buildLess);
gulp.task('default',
  gulp.series('clean',
    gulp.parallel('copy-static', 'copy-fonts', 'less', 'code-watch'),
    'static-watch'
  )
);
