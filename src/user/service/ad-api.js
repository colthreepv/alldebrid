'use strict';
var api = {
  register: '/ad/register/',
  torrent: '/ad/torrent/',
  torrentAjax: '/ad/api/torrent.php',
  convert: '/ad/service.php',
  postTorrent: '/torrent/'
};
var retryForever = true;
var retryTimeout = 5000;

var ajaxDecayTime = 500; // ms

exports = module.exports = function ($http, $q, $timeout, transformReq) {
  var ajaxStatus = false;
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
      if (!error || !error.config || !retryForever) throw new Error(error);
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

  this.addTorrent = function (link, uid) {
    return httpRetry({
      method: 'POST',
      url: api.postTorrent,
      transformRequest: transformReq,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8' },
      data: {
        domain: 'http://www.alldebrid.com/torrent/',
        uid: uid,
        magnet: link
      }
    });
  };

  /**
   * Time 0: HTTP request starts
   * Time 600: HTTP request completes
   * Time 600: $timeout planned for Time 950 sends 'completed'
   * Time 750: HTTP request starts - $timeout must be canceled
   */

  // pub/sub to broadcast AJAX events through all application
  var ajaxListeners = [];
  var ajaxTimeout, isCanceled;
  function sendAjax (newValue) {
    isCanceled = $timeout.cancel(ajaxTimeout); // cancel the scheduled $timeout
    if (isCanceled === true) { // means the user was getting a notification after 350ms saying 'completed', but instead a new HTTP occurred
      if (newValue === false) ajaxTimeout = $timeout(notifyAjax.bind(null, newValue), ajaxDecayTime);
      // if the new value is 'true', don't do anything, let the user wait for the 'false' notification
    } else {
      if (newValue === false) ajaxTimeout = $timeout(notifyAjax.bind(null, newValue), ajaxDecayTime);
      else notifyAjax(newValue);
    }
  }
  function notifyAjax (newValue) {
    ajaxStatus = newValue;
    ajaxListeners.forEach(function (cb) {
      cb(newValue);
    });
  }

  this.onAjax = function (cb) {
    ajaxListeners.push(cb); // add the listener to the queue
    cb(ajaxStatus); // propagate actual status;
  };

  this.httpRetry = httpRetry;
};
exports.$inject = ['$http', '$q', '$timeout', 'transformReq'];
