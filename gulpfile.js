'use strict';

let gulp = require('gulp');

function defaultTask (done) {
  console.log('hello world');
  done();
}

gulp.task('default', defaultTask);
