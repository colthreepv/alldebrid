angular.module('ad')
.factory('adLogin', function ($http, $q, $timeout, uidFetcher) {
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

        // get uid for that user
        uidFetcher(logoutKey).then(function success (uid) {
          asyncLogin.resolve({
            key: logoutKey,
            uid: uid
          });
        }, function failure (reason) {
          // that should never happen.
          console.log(reason);
          asyncLogin.reject(reason);
        });
      });
      // }, 15000);

      return asyncLogin.promise;
    }
  };
})
.factory('transformRequestAsFormPost', function() {
  // serializes the given Object into a key-value pair string. This
  // method expects an object and will default to the toString() method.
  // --
  // NOTE: This is an altered version of the jQuery.param() method which
  // will serialize a data collection for Form posting.
  // --
  // https://github.com/jquery/jquery/blob/master/src/serialize.js#L45
  function serializeData (data) {
    // If this is not an object, defer to native stringification.
    if (!angular.isObject(data)) {
      return (data === null) ? '' : data.toString();
    }
    var buffer = [];
    // Serialize each key in the object.
    for (var name in data) {
      if (!data.hasOwnProperty(name)) {
        continue;
      }
      var value = data[name];
      buffer.push(encodeURIComponent(name) + '=' + encodeURIComponent((value === null) ? '' : value));
    }
    // Serialize the buffer and clean it up for transportation.
    var source = buffer.join('&').replace(/%20/g, '+');
    return source;
  }

  // Return the factory value.
  return function (data, getHeaders) {
    return serializeData(data);
  };
})
.factory('chromeStorage', function ($q) {
  return {
    set: function (name, value) {
      var setDone = $q.defer();
      var setObj = {};
      if (angular.isObject(value)) {
        setObj[name] = angular.toJson(value);
        chrome.storage.sync.set(setObj, function () {
          setDone.resolve();
        });
      }
      if (angular.isString(value)) {
        setObj[name] = value;
        chrome.storage.sync.set(setObj, function () {
          setDone.resolve();
        });
      }

      return setDone.promise;
    },
    get: function (name, type) {
      var getDone = $q.defer();
      if (type === 'object') {
        chrome.storage.sync.get(name, function (items) {
          if (angular.isUndefined(items[name])) {
            getDone.reject();
          } else {
            getDone.resolve(angular.fromJson(items[name]));
          }
        });
      }
      if (type === 'string') {
        chrome.storage.sync.get(name, function (items) {
          if (angular.isUndefined(items[name])) {
            getDone.reject();
          } else {
            getDone.resolve(items[name]);
          }
        });
      }

      return getDone.promise;
    }
  };
})
/**
 * uidFetcher is a service that relies on chromeStorage to cache a set of:
 * logoutKey -> uid
 *
 * It returns a promise, that *should* (quite always, except connection failure)
 * get resolved.
 */
.factory('uidFetcher', function ($http, $q, $timeout, chromeStorage) {

  function fetchPage (callback) {
    $http({
      method: 'GET',
      url: 'http://www.alldebrid.com/torrent/'
    }).success(function (data, status, headers, config) {
      var uid = data.match(/name="uid" value="(.*)"/)[1];
      chromeStorage.set('uid.' + logoutKey, uid);
      callback(uid);
    }).error(function (data, status, headers, config) {
      $timeout(fetchPage.bind(null, callback), 5000);
    });
  }

  return function (logoutKey) {
    var uidDone = $q.defer();

    chromeStorage.get('uid.' + logoutKey, 'string')
    .then(function success (uid) {
      uidDone.resolve(uid);
    }, function failure (reason) {

      // forever-retry function
      fetchPage(function (uid) {
        uidDone.resolve(uid);
      });
    });

    return uidDone.promise;
  };
});
