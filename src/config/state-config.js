module.exports = function ($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise(function ($injector, $location) {
    var // injecting modules
      $state = $injector.get('$state'),
      login = $injector.get('login');

    login.isLogged().then(function () {
      $state.go('home');
    }, function () {
      $state.go('login');
    });
  });

  $stateProvider.state('home', {
    templateUrl: 'controller/home.tpl.html',
    controllerAs: 'home'
  });

};
