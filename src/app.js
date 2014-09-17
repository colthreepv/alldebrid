angular.module('ad', ['cfp.hotkeys'])
.run(function (adLogin, $rootScope) {
  /**
   * loginStatus has 3 statuses for now:
   *  * working
   *  * login
   *  * anon
   */
  $rootScope.recaptchaWarning = false;
  $rootScope.loginStatus = 'working';
  $rootScope.loginFailed = false;

  adLogin.isLogged().then(function success (userData) {
    $rootScope.loginStatus = 'login';
    $rootScope.loginFailed = false;
    $rootScope.logoutKey = userData.logoutKey;
    $rootScope.uid = userData.uid;
  }, function failure (details) {
    if (!!details.recaptcha) {
      $rootScope.recaptchaWarning = true;
    }
    $rootScope.loginStatus = 'anon';
  });

})
.controller('BodyController', function ($scope, $rootScope, $http, adLogin) {
  // login functions
  $scope.login = {};

  // copy-paste from .run code
  $scope.loginUser = function() {
    adLogin.login($scope.login.username, $scope.login.password)
    .then(function success (userData) {
      $rootScope.loginStatus = 'login';
      $rootScope.loginFailed = false;
      $rootScope.logoutKey = userData.logoutKey;
      $rootScope.uid = userData.uid;

      // clean scope values
      delete $scope.login.username;
      delete $scope.login.password;
    }, function failure (details) {
      if (details.recaptcha) {
        $rootScope.recaptchaWarning = true;
      }

      $rootScope.loginStatus = 'anon';
      $rootScope.loginFailed = true;
    });

    $rootScope.loginStatus = 'working';
  };

  $scope.logoutUser = function() {
    adLogin.logout($rootScope.logoutKey)
    .then(function success () {
      $rootScope.loginStatus = 'anon';
    }, function failure () {
      $rootScope.loginStatus = 'login';
    });

    $rootScope.loginStatus = 'working';
  };

  $scope.showLinks = false;
  $scope.showTorrents = false;

  $scope.$on('torrentLinks', function (event, args) {
    $scope.showLinks = true;
  });

  $scope.$on('forceUpdateTorrents', function (event, args) {
    $scope.$broadcast('updateTorrents');
  });
});
