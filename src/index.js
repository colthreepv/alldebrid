'use strict';

var bulk = require('bulk-require');
var modules = bulk(__dirname, ['./*/**/!(index|_*|*.spec).js']);

var angular = require('angular');
var AD = angular.module('ad', ['cfp.hotkeys', 'ui.router', 'templates']);

angular.forEach(modules, function (moduleObj) { // cycle all app components: home, user...
  angular.forEach(moduleObj, function (moduleCollection, moduleType) { // cycle angular types: constant, service, controller....
    angular.forEach(moduleCollection, function (moduleFn, moduleName) { // cycle specific files to be injected: angular.controller('filaname')
      var camelCased = moduleName; // converts hype-nated files to camelCased
      camelCased = camelCased.replace(/-([a-z])/g, function (g) {
        return g[1].toUpperCase();
      });
      if (camelCased !== moduleName) {
        moduleCollection[camelCased] = moduleCollection[moduleName];
        delete moduleCollection[moduleName];
      }
      if (moduleType === 'config' || moduleType === 'run') return AD[moduleType](moduleFn);
      AD[moduleType](camelCased, moduleFn);
    });
  });
});

console.log(modules);
