'use strict';
var api = {
  register: '/ad/register/',
  torrent: '/ad/torrent/',
  torrentAjax: '/ad/api/torrent.php',
  convert: '/ad/service.php'
};
var retryForever = true;
var retryTimeout = 5000;

exports = module.exports = function ($http, $q, $timeout) {
  /**
   * httpRetry is a function to substitute to normal $http call
   * @return {Promise} -> $http response
   */
  function httpRetry () {
    var args = arguments;
    var httpPromise = $http.apply(null, args);
    sendAjax(true);

    return httpPromise.then(function (response) {
      sendAjax(false);
      return response;
    // in case there is an error
    }).catch(function (error) {
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

  this.fetchTorrents = function () {
    return httpRetry({
      method: 'GET',
      url: api.torrentAjax,
      params: {
        json: true
      }
    });
  };

  this.removeTorrents = function (id) {
    return httpRetry({
      method: 'GET',
      url: api.torrent,
      params: {
        action: 'remove',
        id: id
      }
    });
  };

  this.convert = function (link) {
    return httpRetry({
      method: 'GET',
      url: api.convert,
      params: {
        link: link,
        json: true
      }
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


  // pub/sub to broadcast AJAX events through all application
  var ajaxListeners = [];
  function sendAjax (newValue) {
    ajaxListeners.forEach(function (cb) {
      cb(newValue);
    });
  }
  this.onAjax = function (cb) {
    ajaxListeners.push(cb);
  };

  this.httpRetry = httpRetry;
};
exports.$inject = ['$http', '$q', '$timeout'];
