angular.module('ad')
.factory('adLogin', function ($http, $q, $timeout, uidFetcher) {
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
      if (!!page.querySelector('.login textarea[name="recaptcha_challenge_field"]')) {
        // A wild recaptcha appears
        return callback(false, {
          recaptcha: true
        });
      }
      if (!!page.querySelector('#toolbar span a.toolbar_welcome')) {
        return callback(false, {});
      }
      if (!!page.querySelector('strong a')) {
        callback(true, {
          username: page.querySelector('strong a').textContent,
          remainingDays: page.querySelector('.toolbar_welcome').textContent.match(/in (\d*) days/)[1],
          logoutKey: page.querySelector('.toolbar_disconnect').getAttribute('href').split('key=')[1]
        });
      }
    };
  }

  function parseLogout (callback) {
    return function (page, status, headers, config) {
      if (!!page.querySelector('#toolbar span a.toolbar_welcome')) {
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
    isLogged: function() {
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
          login_login: username,
          login_password: password
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
 * It returns a promise, that gets resolved always (forever-loop)
 */
.factory('uidFetcher', function ($http, $q, $timeout, chromeStorage) {

  function fetchPage (callback) {
    $http({
      method: 'GET',
      url: 'http://www.alldebrid.com/torrent/'
    }).success(function (data, status, headers, config) {
      var uid = data.match(/name="uid" value="(.*)"/)[1];
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
        chromeStorage.set('uid.' + logoutKey, uid);
        uidDone.resolve(uid);
      });
    });

    return uidDone.promise;
  };
});
