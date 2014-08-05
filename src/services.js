angular.module('ad')
.factory('adLogin', function ($http, $q, $timeout) {

  // returns a promise
  // var asyncLogin = $q.defer();
  // chrome.storage.sync.get('loginInfo', function (items) {
  //   if (!!items.length) {
  //     asyncLogin.resolve(items);
  //   } else {
  //     asyncLogin.reject('storage empty');
  //   }
  // });

  // return asyncLogin.promise;

  /**
   * checkLogin is a loop-call function in case of connection failure
   * [callback] has parameters (err, isLoggedin, logoutKey)
   */
  var retryCount = 0;
  function checkLogin (callback) {
    $http({ method: 'GET', url: 'http://www.alldebrid.com' })
    .success(function (data, status, headers, config) {
      retryCount = 0;
      if (data.match(/Sign in/)) {
        callback(null, false);
      } else {
        callback(null, true, data.match(/\/register\/\?action=logout\&key=(.*)" /)[1]);
      }
    })
    .error(function (data, status, headers, config) {
      // return error
      if (retryCount > 3) {
        callback('reached retry limit: ' + retryCount);
      }

      // retry connection
      $timeout(function () {
        retryCount += 1;
        console.log('retry login...');
        checkLogin(callback);
      }, 2500 * (retryCount + 1));
    });
  }

  return {
    // isLogged returns a promise
    isLogged: function () {
      var asyncLogin = $q.defer();
      // $timeout(function () {
      checkLogin(function (err, loggedIn, logoutKey) {
        if (err || !loggedIn) {
          asyncLogin.reject(err);
        }
        asyncLogin.resolve(logoutKey);
      });
      // }, 15000);

      return asyncLogin.promise;
    }
  };
});