'use strict';
var api = {
  register: '/ad/register/',
  torrent: '/ad/torrent/',
  torrentAjax: '/ad/api/torrent.php'
};
var retryForever = true;
var retryTimeout = 5000;

exports = module.exports = function ($http, $q, $timeout) {

  function httpRetry () {
    var args = arguments;
    var httpPromise = $http.apply(null, args);

    // in case there is an error
    return httpPromise.catch(function (error) {
      // re-throw in case is not an http-error or if retry is disabled
      if (!error || !error.data || !error.status || !retryForever) throw new Error(error);
      // applies to timeout extended parameters: https://docs.angularjs.org/api/ng/service/$timeout
      // the 3 $timeout parameters gets concatenated with original httpRetry arguments, using slice as
      // `arguments`  it's not a real Array
      return $timeout.apply(null, [httpRetry, retryTimeout, false].concat(Array.prototype.slice.call(args)));
    });
  }

  this.checkLogin = function () {
    return httpRetry({
      method: 'GET',
      url: api.register,
      responseType: 'document'
    });
  };

  this.fetchUid = function () {
    return httpRetry({
      method: 'GET',
      url: api.torrent
    }).then(function (response) {
      return response.data.match(/name="uid" value="(.*)"/)[1];
    });
  };

  this.doLogin = function (username, password) {
    return httpRetry({
      method: 'GET',
      url: api.register,
      params: {
        action: 'login',
        'login_login': username,
        'login_password': password
      },
      responseType: 'document'
    });
  };

  this.doLogout = function (key) {
    return httpRetry({
      method: 'GET',
      url: api.register,
      params: {
        action: 'logout',
        key: key
      },
      responseType: 'document'
    });
  };


  this.httpRetry = httpRetry;
};
exports.$inject = ['$http', '$q', '$timeout'];
