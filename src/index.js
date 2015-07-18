'use strict';

var bulk = require('bulk-require');
var modules = bulk(__dirname, ['./*/**/!(index|_*|*.spec).js']);

var angular = require('angular');
var AD = angular.module('ad', ['cfp.hotkeys', 'ui.router', 'templates']);

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
    if (type === 'config' || type === 'run') return AD[type](modules[type][camelCased]);
    AD[type](camelCased, modules[type][camelCased]);
  });
});

console.log(modules);
