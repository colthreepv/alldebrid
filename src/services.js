angular.module('adMain')
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

  var retryCount = 0;
  function checkLogin (callback) {
    $http({ method: 'GET', url: 'http://www.alldebrid.com' })
    .success(function (data, status, headers, config) {
      retryCount = 0;
      if (data.match(/Sign in/)) {
        callback(null, false);
      } else {
        callback(null, true);
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
      checkLogin(function (err, loggedIn) {
        if (err) {
          asyncLogin.reject(err);
        }
        asyncLogin.resolve(loggedIn);
      });
      // }, 15000);

      return asyncLogin.promise;
    }
  };
});