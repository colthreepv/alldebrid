'use strict';

const registerUrl = '/ad/register/';
const retryForever = false;

module.exports = ['$http', '$q', '$timeout', 'uidFetcher', function ($http, $q, $timeout, uidFetcher) {
  /**
   * checkLogin is a loop-call function in case of connection failure
   * [callback] has parameters (isLoggedin, details)
   *
   * parseLogin has same parameters (isLoggedin, details)
   * parseLogin - also gets used in other methods
   *
   * parseLogout has parameter (isLoggedOut)
   */
  function parseLogin (page) {
    if (page.querySelector('.login textarea[name="recaptcha_challenge_field"]')) {
      // A wild recaptcha appears
      return { logged: false, recaptcha: true };
    }
    if (page.querySelector('#toolbar span a.toolbar_welcome')) {
      return { logged: false };
    }
    if (page.querySelector('strong a')) {
      var days = page.querySelector('.toolbar_welcome').textContent.match(/in (\d*) days/);
      return {
        logged: true,
        username: page.querySelector('strong a').textContent,
        remainingDays: days ? parseInt(days[1], 10) : 0,
        logoutKey: page.querySelector('.toolbar_disconnect').getAttribute('href').split('key=')[1]
      };
    }
  }

  function parseLogout (page) {
    if (page.querySelector('#toolbar span a.toolbar_welcome')) return true;
    else return false;
  }

  function checkLogin () {
    return new $q(function (resolve) {
      $http({
        method: 'GET',
        url: registerUrl,
        responseType: 'document'
      })
      .success(function (page) {
        resolve(parseLogin(page));
      })
      .error(function () {
        if (!retryForever) return;
        $timeout(function () {
          resolve(checkLogin());
        }, 5000);
      });
    });
  }

  // when retrieving details of an user, it misses an unique uid necessary for logout
  // this function helps in that
  function retrieveUid (status) {
    return uidFetcher(status.logoutKey).then(function (uid) {
      status.uid = uid;
      return status;
    });
  }

  function attemptLogin (username, password) {
    return new $q(function (resolve) {
      $http({
        method: 'GET',
        url: registerUrl,
        params: {
          action: 'login',
          'login_login': username,
          'login_password': password
        },
        responseType: 'document'
      })
      .success(function (page) {
        resolve(parseLogin(page));
      })
      .error(function () {
        if (!retryForever) return;
        $timeout(function () {
          resolve(attemptLogin(username, password));
        }, 5000);
      });
    });
  }

  function attemptLogout (key) {
    return new $q(function (resolve) {
      $http({
        method: 'GET',
        url: registerUrl,
        params: {
          action: 'logout',
          key: key
        },
        responseType: 'document'
      })
      .success(function (page) {
        resolve(parseLogout(page));
      })
      .error(function () {
        if (!retryForever) return;
        $timeout(function () {
          resolve(attemptLogout(key));
        }, 5000);
      });
    });
  }

    // isLogged returns a promise
  this.isLogged = function () {
    return checkLogin().then(function (status) {
      if (status.logged) return retrieveUid(status);
      return $q.reject(status);
    });
  };

  this.login = function (username, password) {
    return attemptLogin(username, password).then(function (status) {
      if (status.logged) return retrieveUid(status);
      return $q.reject(status);
    });
  };

  this.logout = function (key) {
    return attemptLogout(key).then(function (status) {
      if (status === true) return $q.resolve();
      return $q.reject();
    });
  };

}];
