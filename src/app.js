angular.module('ad', [])
.run(function (adLogin, $rootScope) {
  /**
   * loginStatus has 3 statuses for now:
   *  * working
   *  * login
   *  * anon
   */
  $rootScope.loginStatus = 'working';

  adLogin.isLogged().then(function success (key) {
    $rootScope.loginStatus = 'login';
    $rootScope.logoutKey = key;
  }, function failure (reason) {
    $rootScope.loginStatus = 'anon';
  });

})
.controller('BodyController', function ($scope, $rootScope, $http) {
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
      } else {
        $rootScope.loginStatus = 'login';
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
      console.log(config);
      if (data.match(/Sign in/)) {
        $rootScope.loginStatus = 'anon';
      } else {
        $rootScope.loginStatus = 'login';
      }
    });

    // before AJAX gets completed we set loginStatus to working
    $rootScope.loginStatus = 'working';
  };

});
