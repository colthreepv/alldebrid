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
      },
      chrome: {
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
          archive: pkg.name + '-' + pkg.version + '.' + grunt.option('chromev') + '.zip',
          mode: 'zip',
          level: 9,
          pretty: true
        }
      }
    }
  });

  grunt.registerTask('build', ['bower:install', 'compress:build']);

  // Intermediate tasks
  grunt.registerTask('chrome', 'Builds a package specifically for Chrome Webstore, with a custom version', function() {
    var manifest = require('./manifest.json');
    var chromeVersion;
    if (chromeVersion = grunt.option('chromev'), !chromeVersion) {
      grunt.fail.fatal('required --chromev=x, not given. Specific version for Chrome Webstore.');
    }
    var fs = require('fs');
    manifest.version = manifest.version + '.' + chromeVersion;

    // backup original manifest
    grunt.file.copy('./manifest.json', './manifest.json.backup');

    // write manifest with customized version
    fs.writeFileSync('manifest.json', JSON.stringify(manifest, null, 2));
  });
  grunt.registerTask('chrome-unroll', 'Puts back the backupped manifest.json to original', function() {
    grunt.file.copy('./manifest.json.backup', './manifest.json');
    grunt.file.delete('./manifest.json.backup');
  });
  // The task to be used to build a Chrome Webstore package.
  grunt.registerTask('build-chrome', ['bower:install', 'chrome', 'compress:chrome', 'chrome-unroll']);

  // custom task to do version bumps
  grunt.registerTask('setver', 'Sets a new version in manifest.json, package.json and bower.json', function() {
    if (grunt.option('setver') === null || grunt.option('setver') === undefined) {
      grunt.fail.fatal('required --setver=x.x.x, not given.');
    }

    var fs = require('fs');
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
