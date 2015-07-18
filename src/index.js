'use strict';

var bulk = require('bulk-require');
var modules = bulk(__dirname, ['./*/**/!(index|_*|*.spec).js']);

// cycle all the angular components
Object.keys(modules).forEach(function (type) {
  // cycle specific component type, ex: all config(s)
  Object.keys(modules[type]).forEach(function (moduleName) {
    var camelCased = moduleName;
    camelCased = camelCased.replace(/-([a-z])/g, function (g) {
      return g[1].toUpperCase();
    });
    if (camelCased !== moduleName) {
      modules[type][camelCased] = modules[type][moduleName];
      delete modules[type][moduleName];
    }
    angular[type](camelCased, modules[type][camelCased]);
  });
});

var angular = require('angular');

var AD = angular.module('ad', ['cfp.hotkeys', 'ui-router', 'templates']);
// AD.run(require('./run'));
// AD.config(require('./config'));
// AD.filter('bytes', require('./filter/bytes'));
// AD.controller('BodyController', require('./controller/body'));
// AD.controller('AddController', require('./controller/add'));
// AD.controller('LinksController', require('./controller/links'));
// AD.controller('TorrentController', require('./controller/torrent'));
// AD.factory('adLogin', require('./service/login'));
// AD.factory('transformRequestAsFormPost', require('./service/transformReq'));
// AD.factory('chromeStorage', require('./service/chromeStorage'));
// AD.factory('uidFetcher', require('./service/uidFetcher'));
