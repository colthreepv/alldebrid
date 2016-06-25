import '../../css/index.scss';
import angular from 'angular';
import uiRouter from 'angular-ui-router';

import filters from '../main/filters';
import factories from '../main/factories';

import states from '../main/index';

import http from '../shared/http';
import api from '../shared/api';

if (process.env.NODE_ENV === 'development') Error.stackTraceLimit = Infinity;
const app = angular.module('main', [uiRouter]);

app
  .factory('http', http)
  .factory('api', api)
  .config(config)
  .run(run);

angular.forEach(filters, (filter, name) => app.filter(name, filter));
angular.forEach(factories, (factory, name) => app.factory(name, factory));

if (process.env.NODE_ENV === 'production') app.config(performance);

function run ($rootScope, magnet) {
  ['$stateChangeSuccess', '$stateChangeStart', '$stateChangeError', '$stateNotFound'].forEach(event => {
    $rootScope.$on(event, function () {
      console.log(event);
    });
  });
  console.log('angular-main is running');
  magnet.boot();
}

function performance ($compileProvider) {
  $compileProvider.debugInfoEnabled(false);
}

function config ($stateProvider, $locationProvider, $urlMatcherFactoryProvider, $compileProvider) {
  $locationProvider.html5Mode(true);
  $urlMatcherFactoryProvider.strictMode(false);
  states.forEach(state => $stateProvider.state(state));
  $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|tel|file|blob):/);
}
