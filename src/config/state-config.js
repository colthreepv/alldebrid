module.exports = ['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise(function ($injector) {
    var // injecting modules
      $state = $injector.get('$state'),
      user = $injector.get('user');

    user.isLogged().then(function () {
      $state.go('home');
    }, function () {
      $state.go('login');
    });
  });

  $stateProvider.state('home', {
    templateUrl: 'controller/torrent.tpl.html',
    controller: 'torrent'
  });
  $stateProvider.state('login', {
    templateUrl: 'controller/login.tpl.html',
    controller: 'loginCtrl as login'
  });

}];
