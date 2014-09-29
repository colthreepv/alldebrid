module.exports = function (grunt) {
  grunt.loadNpmTasks('grunt-bower-task');
  grunt.loadNpmTasks('grunt-contrib-compress');

  var pkg = require('./package.json');

  grunt.config.init({
    bower: {
      install: {
        options: {
          copy: false,
          install: true,
          verbose: true,
          bowerOptions: {
            forceLatest: true,
            production: true
          }
        }
      }
    },
    compress: {
      build: {
        files: [
          { src: [
            'icon_128.png',
            'icon_48.png',
            'main.js',
            'manifest.json',
            'index.html',
            'libs/angular-hotkeys/build/hotkeys.?s*',
            'libs/angularjs/angular.js',
            'libs/angularjs/angular-csp.css',
            'libs/bootstrap/dist/css/bootstrap.css',
            'libs/bootstrap/dist/css/bootstrap-theme.css',
            'libs/bootstrap/dist/fonts/*',
            'css/**',
            'src/**'
          ], dest: '.' }
        ],
        options: {
          archive: 'dist/' + pkg.name + '-' + pkg.version + '.zip',
          mode: 'zip',
          level: 9,
          pretty: true
        }
      }
    }
  });

  grunt.registerTask('build', ['bower:install', 'compress']);

  // custom task to do version bumps
  grunt.registerTask('setver', 'Sets a new version in manifest.json, package.json and bower.json', function () {
    if (grunt.option('setver') === null || grunt.option('setver') === undefined) {
      grunt.fail.fatal('required --setver=x.x.x, not given.');
    }

    var fs = require('fs');
    // console.log(grunt.option('setver'));
    var newVersion = grunt.option('setver');
    var files = [
      { file: 'bower.json', data: require('./bower.json') },
      { file: 'manifest.json', data: require('./manifest.json') },
      { file: 'package.json', data: require('./package.json') },
    ];
    files.forEach(function (f) {
      f.data.version = newVersion;
      fs.writeFileSync(f.file, JSON.stringify(f.data, null, 2));
      grunt.log.ok('Updated ' + f.file + ' to version: ' + newVersion);
    });
  });
};
