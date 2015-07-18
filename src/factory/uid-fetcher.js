'use strict';
/**
 * uidFetcher is a service that relies on chromeStorage to cache a set of:
 * logoutKey -> uid
 *
 * It returns a promise, that gets resolved always (forever-loop)
 */
module.exports = ['$http', '$q', '$timeout', 'chromeStorage', function ($http, $q, $timeout, chromeStorage) {

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
}];
