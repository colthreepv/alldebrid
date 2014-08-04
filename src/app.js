angular.module('adMain', [])
.run(function (adLogin, $rootScope) {
  /**
   * loginStatus has 3 statuses for now:
   *  * working
   *  * done
   *  * failed
   */
  $rootScope.loginStatus = 'working';

  adLogin.isLogged().then(function success (value) {
    $rootScope.loginStatus = 'done';
  }, function failure (reason) {
    $rootScope.loginStatus = 'failed';
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
        $rootScope.loginStatus = 'done';
      } else {
        $rootScope.loginStatus = 'failed';
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
        action: 'login',
        login_login: '',
        login_password: ''
      }
    }).success(function (data, status, headers, config) {
      if (data.match(/Sign in/)) {
        $rootScope.loginStatus = 'done';
      } else {
        $rootScope.loginStatus = 'failed';
      }
    });

    // before AJAX gets completed we set loginStatus to working
    $rootScope.loginStatus = 'working';
  };

});