'use strict';

let // gulp deps
  gulp = require('gulp'),
  revHash = require('./rev-hash'),
  render = require('gulp-nunjucks-render');

let path = require('path');
let pkg = require(path.join(process.cwd(), 'package.json'));

// nunjucks configuration
render.nunjucks.configure([process.cwd()], {
  tags: { // custom tags to not collide with angular
    variableStart: '<<',
    variableEnd: '>>'
  },
  watch: false
});

function createNunjucksBuild (destDir, production) {
  let context = {
    build: production ? 'production' : 'development',
    rev: revHash.data,
    libs: pkg['production-deps']
  };

  return function nunjucksBuild () {
    return gulp.src('index.j2')
      .pipe(render(context))
      .pipe(gulp.dest(destDir));
  };
}

exports = module.exports = createNunjucksBuild;
exports.render = render;
