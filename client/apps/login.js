import '../../css/index.scss';
import './login.scss';
import 'angular-ui-router';

import angular from 'angular';

import home from '../login/index';

import http from '../shared/http';
import api from '../shared/api';

if (process.env.NODE_ENV === 'development') Error.stackTraceLimit = Infinity;

const app = angular.module('login', ['ui.router']);

function run () {
  console.log('angular-login is running');
}

function config ($stateProvider) {
  $stateProvider
    .state('home', home);
}
config.$inject = ['$stateProvider'];

app
  .factory('http', http)
  .factory('api', api)
  .config(config)
  .run(run);
