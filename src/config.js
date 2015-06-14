'use strict';
module.exports = function ($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise(function ($injector, $location) {
    var $state = $injector.get('$state');
    $state.go('home');
  });

  $stateProvider.state('home', {
    templateUrl: 'controller/home.tpl.html',
    controller: require('./controller/home'),
    controllerAs: 'home'
  });

};
