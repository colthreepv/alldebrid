'use strict';

let path = require('path');

let // gulp deps
  gulp = require('gulp'),
  gutil = require('gulp-util'),
  nunjucksRender = require('gulp-nunjucks-render'),
  rev = require('gulp-rev'),
  tmpl = require('gulp-angular-templatecache');

let // external deps
  del = require('del');

let tasks = require('./tasks');

// nunjucks configuration
nunjucksRender.nunjucks.configure([process.cwd()], {
  tags: { // custom tags to not collide with angular
    variableStart: '<<',
    variableEnd: '>>'
  },
  watch: false
});

const destDir = 'build';
const staticList = [
  'index.j2'
];

gulp.task('copy-libs', tasks.copyLibs(destDir));

gulp.task('j2', function () {
  return gulp.src(staticList)
    .pipe(nunjucksRender({ rev: rev.data }))
    .pipe(gulp.dest(destDir));
});

gulp.task('copy-fonts', function () {
  return gulp.src([
    'node_modules/bootstrap-less/fonts/glyphicons-halflings-regular.woff',
    'node_modules/bootstrap-less/fonts/glyphicons-halflings-regular.woff2',
    'node_modules/bootstrap-less/fonts/glyphicons-halflings-regular.ttf'
  ]).pipe(gulp.dest(path.join(destDir, 'fonts')));
});

gulp.task('templates', function () {
  return gulp.src('src/**/*.tpl.html')
    .pipe(tmpl({
      standalone: true
    }))
    .pipe(rev())
    .pipe(gulp.dest(destDir));
});

gulp.task('watch', function (done) {
  gulp.watch('index.j2', gulp.series('j2'));
  gulp.watch('css/**/*.less', gulp.series('less', 'j2'));
  gulp.watch('src/**/*.tpl.html', gulp.series('templates', 'j2'));
  gulp.watch('src/**/*.js', gulp.series('code-build', 'j2'));

  let proxy = require('./dev-proxy');
  let listen = proxy.listen(3000, '127.0.0.1', function () {
    gutil.log(gutil.colors.magenta('Proxy server listening on:'), 'http://' + listen.address().address + ':' + listen.address().port + '/');
    done();
  });
});

gulp.task('code-build', tasks.browserify(destDir));
gulp.task('clean', del.bind(null, destDir));
gulp.task('git', tasks.git);
gulp.task('less', tasks.less(destDir));

// build only task
gulp.task('build', gulp.series(
  gulp.parallel('clean', 'git'),
  gulp.parallel('copy-fonts', 'copy-libs', 'less', 'templates', 'code-build'),
  gulp.series('j2')
));

// watch
gulp.task('default', gulp.series('build', 'watch'));
