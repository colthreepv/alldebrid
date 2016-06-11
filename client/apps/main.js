import '../../css/index.scss';
import angular from 'angular';
import uiRouter from 'angular-ui-router';

import home from '../login/index';

import http from '../shared/http';
import api from '../shared/api';

if (process.env.NODE_ENV === 'development') Error.stackTraceLimit = Infinity;
const app = angular.module('main', [uiRouter]);

app
  .factory('http', http)
  .factory('api', api)
  .config(config)
  .run(run);

if (process.env.NODE_ENV === 'production') app.config(performance);

function run () {
  console.log('angular-main is running');
}

function performance ($compileProvider) {
  $compileProvider.debugInfoEnabled(false);
}

function config ($stateProvider, $locationProvider, $urlMatcherFactoryProvider) {
  $locationProvider.html5Mode(true);
  $urlMatcherFactoryProvider.strictMode(false);
  $stateProvider.state(home);
}
