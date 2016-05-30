import '../../css/index.scss';
import './login.scss';
import 'angular-ui-router';

import angular from 'angular';
import navbar from '../login/navbar';
import http from '../shared/http';

const app = angular.module('login', ['ui.router']);

function run () {
  console.log('angular-login is running');
}

function config ($stateProvider) {
  $stateProvider
    .state('navbar', navbar);
}
config.$inject = ['$stateProvider'];

app
  .factory('http', http)
  .config(config)
  .run(run);
