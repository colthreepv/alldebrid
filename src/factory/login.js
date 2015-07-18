'use strict';

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
  function parseLogin (callback) {
    return function (page, status, headers, config) {
      if (page.querySelector('.login textarea[name="recaptcha_challenge_field"]')) {
        // A wild recaptcha appears
        return callback(false, {
          recaptcha: true
        });
      }
      if (page.querySelector('#toolbar span a.toolbar_welcome')) {
        return callback(false, {});
      }
      if (page.querySelector('strong a')) {
        var days = page.querySelector('.toolbar_welcome').textContent.match(/in (\d*) days/);
        callback(true, {
          username: page.querySelector('strong a').textContent,
          remainingDays: days ? parseInt(days[1], 10) : 0,
          logoutKey: page.querySelector('.toolbar_disconnect').getAttribute('href').split('key=')[1]
        });
      }
    };
  }

  function parseLogout (callback) {
    return function (page, status, headers, config) {
      if (page.querySelector('#toolbar span a.toolbar_welcome')) {
        return callback(true);
      } else {
        return callback(false);
      }
    };
  }

  function checkLogin (callback) {
    $http({
      method: 'GET',
      url: 'http://www.alldebrid.com/register/',
      responseType: 'document'
    })
    .success(parseLogin(callback))
    .error(function (data, status, headers, config) {
      $timeout(checkLogin.bind(null, callback), 5000);
    });
  }

  return {
    // isLogged returns a promise
    isLogged: function () {
      var asyncLogin = $q.defer();
      // $timeout(function () {
      checkLogin(function (isLoggedIn, details) {
        if (!isLoggedIn) {
          return asyncLogin.reject(details);
        }

        // get uid for that user
        uidFetcher(details.logoutKey).then(function success (uid) {
          asyncLogin.resolve(angular.extend(details, {
            uid: uid
          }));
        });
      });
      // }, 15000);

      return asyncLogin.promise;
    },
    login: function (username, password, recaptchaData) {
      var asyncLogin = $q.defer();
      $http({
        method: 'GET',
        url: 'http://www.alldebrid.com/register/',
        params: {
          action: 'login',
          'login_login': username,
          'login_password': password
        },
        responseType: 'document'
      })
      // this has same code as isLogged - it might be useful to make a function out of it
      .success(parseLogin(function (isLoggedIn, details) {
        if (!isLoggedIn) {
          return asyncLogin.reject(details);
        }

        // get uid for that user
        uidFetcher(details.logoutKey).then(function success (uid) {
          asyncLogin.resolve(angular.extend(details, {
            uid: uid
          }));
        });
      }));

      return asyncLogin.promise;
    },
    logout: function (key) {
      var asyncLogout = $q.defer();
      $http({
        method: 'GET',
        url: 'http://www.alldebrid.com/register/',
        params: {
          action: 'logout',
          key: key
        },
        responseType: 'document'
      })
      .success(parseLogout(function (isLoggedOut) {
        if (!isLoggedOut) {
          return asyncLogout.reject();
        }
        asyncLogout.resolve();
      }));

      return asyncLogout.promise;
    }
  };
}];
