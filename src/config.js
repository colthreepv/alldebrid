'use strict';
module.exports = function ($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/');

  $stateProvider.state('home', {
    url: '/',
    templateUrl: 'home.tpl.html',
    controller: require('./controller/home'),
    controllerAs: 'home'
  });

};
