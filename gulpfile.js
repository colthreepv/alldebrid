'use strict';

let path = require('path');

let // gulp deps
  gulp = require('gulp'),
  gutil = require('gulp-util'),
  nunjucks = require('gulp-nunjucks-render'),
  rev = require('gulp-rev'),
  tmpl = require('gulp-angular-templatecache');

let // external deps
  del = require('del');

let tasks = require('./tasks');

const destDir = 'build';
const staticList = [
  'index.j2'
];

gulp.task('copy-libs', tasks.copyLibs(destDir));

gulp.task('rev-static', function () {
  return gulp.src('build/*.js')
    .pipe(rev())
    .pipe(gulp.dest(destDir));
});

gulp.task('index', function () {
  return gulp.src(staticList)
    .pipe(nunjucks())
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
  gulp.watch(staticList, gulp.series('copy-static'));
  gulp.watch('css/**/*.less', tasks.less(destDir));
  gulp.watch('src/**/*.tpl.html', gulp.series('templates'));
  gulp.watch('src/**/*.js', tasks.browserify(destDir));

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
  gulp.series('index')
));

// watch
gulp.task('default', gulp.series('build', 'watch'));
