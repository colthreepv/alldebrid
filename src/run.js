'use strict';
module.exports = function (adLogin, $rootScope) {
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
    if (details.recaptcha) {
      $rootScope.recaptchaWarning = true;
    }
    $rootScope.loginStatus = 'anon';
  });

};
