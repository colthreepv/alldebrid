'use strict';
module.exports = function ($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise(function ($injector, $location) {
    var // injecting modules
      $state = $injector.get('$state'),
      adLogin = $injector.get('adLogin');

    adLogin.isLogged().then(function () {
      $state.go('home');
    }, function () {
      $state.go('login');
    });
  });

  $stateProvider.state('home', {
    templateUrl: 'controller/home.tpl.html',
    controller: require('./controller/home'),
    controllerAs: 'home'
  });

};
