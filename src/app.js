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

    // user details to rootScope propagation
    $rootScope.paid = (userData.remainingDays > 0) ? true : false;
    $rootScope.remainingDays = userData.remainingDays;
    $rootScope.username = userData.username;
  }, function failure (details) {
    if (!!details.recaptcha) {
      $rootScope.recaptchaWarning = true;
    }
    $rootScope.loginStatus = 'anon';
  });

})
// gently taken from: https://gist.github.com/thomseddon/3511330
.filter('bytes', function() {
  return function (bytes, precision) {
    if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '-';
    if (typeof precision === 'undefined') precision = 1;
    var units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'],
      number = Math.floor(Math.log(bytes) / Math.log(1024));
    return (bytes / Math.pow(1024, Math.floor(number))).toFixed(precision) +  ' ' + units[number];
  };
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

      // user details to rootScope propagation
      $rootScope.paid = (userData.remainingDays > 0) ? true : false;
      $rootScope.remainingDays = userData.remainingDays;
      $rootScope.username = userData.username;

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
