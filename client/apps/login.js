import '../../css/index.scss';

import uiRouter from 'angular-ui-router';
import angular from 'angular';
import ngMessages from 'angular-messages';

import home from '../login/index';

import { apiValidation, formApi } from '../shared/form-api';
import http from '../shared/http';
import api from '../shared/api';
const directives = { apiValidation, formApi };
const factories = { http, api };

if (process.env.NODE_ENV === 'development') Error.stackTraceLimit = Infinity;
const app = angular.module('login', [uiRouter, ngMessages]);

angular.forEach(factories, (factory, name) => app.factory(name, factory));
angular.forEach(directives, (directive, name) => app.directive(name, directive));
app
  .config(config)
  .run(run);

if (process.env.NODE_ENV === 'production') app.config(performance);

function run () {
  console.log('angular-login is running');
}

function performance ($compileProvider) {
  $compileProvider.debugInfoEnabled(false);
}

function config ($stateProvider, $locationProvider, $urlMatcherFactoryProvider) {
  $locationProvider.html5Mode(true);
  $urlMatcherFactoryProvider.strictMode(false);
  $stateProvider.state(home);
}
