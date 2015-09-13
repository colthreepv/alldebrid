exports = module.exports = function ($rootScope, $state, user) {

  // $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams, error) {
  //   console.info(toState);
  // });

  // $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
  //   console.error(error);
  // });

  // user.isLogged().then(function () {
  //   $state.go('home.torrents');
  // },function () {
  //   $state.go('login');
  // });
};
exports.$inject = ['$rootScope', '$state', 'user'];
