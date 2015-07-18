'use strict';

module.exports = function ($scope, $rootScope, $http, login) {
  // login functions
  $scope.login = {};

  // copy-paste from .run code
  $scope.loginUser = function () {
    login.login($scope.login.username, $scope.login.password)
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

  $scope.logoutUser = function () {
    login.logout($rootScope.logoutKey)
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
};
