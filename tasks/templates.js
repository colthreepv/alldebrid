'use strict';

let // gulp
  gulp = require('gulp'),
  rev = require('gulp-rev'),
  revHash = require('./rev-hash'),
  tmpl = require('gulp-angular-templatecache');

function createAngularTemplates (destDir) {
  return function angularTemplates() {
    return gulp.src('src/**/*.tpl.html')
      .pipe(tmpl({
        standalone: true
      }))
      .pipe(rev())
      .pipe(revHash())
      .pipe(gulp.dest(destDir));
  };
}
module.exports = createAngularTemplates;
