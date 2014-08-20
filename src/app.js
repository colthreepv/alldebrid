angular.module('ad', ['cfp.hotkeys'])
.run(function (adLogin, $rootScope) {
  /**
   * loginStatus has 3 statuses for now:
   *  * working
   *  * login
   *  * anon
   */
  $rootScope.loginStatus = 'working';
  $rootScope.loginFailed = false;

  adLogin.isLogged().then(function success (userData) {
    $rootScope.loginStatus = 'login';
    $rootScope.loginFailed = false;
    $rootScope.logoutKey = userData.key;
    $rootScope.uid = userData.uid;
  }, function failure () {
    $rootScope.loginStatus = 'anon';
  });

})
.controller('BodyController', function ($scope, $rootScope, $http) {
  // login functions
  $scope.login = {};
  $scope.loginMe = function () {
    $http({
      method: 'GET',
      url: 'http://www.alldebrid.com/register/',
      params: {
        action: 'login',
        login_login: $scope.login.username,
        login_password: $scope.login.password
      }
    }).success(function (data, status, headers, config) {
      if (data.match(/Sign in/)) {
        $rootScope.loginStatus = 'anon';
        $rootScope.loginFailed = true;
      } else {
        $rootScope.loginStatus = 'login';
        $rootScope.loginFailed = false;
      }
    });

    // before AJAX gets completed we set loginStatus to working
    $rootScope.loginStatus = 'working';
  };

  $scope.logoutMe = function () {
    $http({
      method: 'GET',
      url: 'http://www.alldebrid.com/register/',
      params: {
        action: 'logout',
        key: $rootScope.logoutKey
      }
    }).success(function (data, status, headers, config) {
      if (data.match(/Sign in/)) {
        $rootScope.loginStatus = 'anon';
      } else {
        $rootScope.loginStatus = 'login';
      }
    });

    // before AJAX gets completed we set loginStatus to working
    $rootScope.loginStatus = 'working';
  };

  $scope.showLinks = false;
  $scope.showTorrents = false;

  $scope.$on('torrentLinks', function (event, args) {
    $scope.showLinks = true;
  });

});
