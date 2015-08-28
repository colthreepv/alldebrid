'use strict';
/**
 * uidFetcher is a service that relies on chromeStorage to cache a set of:
 * logoutKey -> uid
 *
 * It returns a promise, that gets resolved always (forever-loop)
 */
const torrentUrl = '/ad/torrent/';

module.exports = ['$http', '$q', '$timeout', function ($http, $q, $timeout) {

  function fetchPage (callback) {
    $http({
      method: 'GET',
      url: torrentUrl
    }).success(function (data) {
      var uid = data.match(/name="uid" value="(.*)"/)[1];
      callback(uid);
    }).error(function () {
      $timeout(fetchPage.bind(null, callback), 5000);
    });
  }

  function getKey (logoutKey) {
    return new $q(function (resolve) {
      var uid = localStorage.getItem('uid.' + logoutKey);
      if (uid) return resolve(uid);

      // AJAX to resolve the uid
      fetchPage(function (uid) {
        localStorage.setItem('uid.' + logoutKey, uid);
        resolve(uid);
      });
    });
  }

  return getKey;
}];
