exports = module.exports = function ($rootScope, $state, user) {
  $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
    debugger;
  });

  user.isLogged().then(function () {
    $state.go('home.torrents');
  },function () {
    $state.go('login');
  });
};
exports.$inject = ['$rootScope', '$state', 'user'];
