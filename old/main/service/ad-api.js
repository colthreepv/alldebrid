'use strict';
var api = {
  register: '/ad/register/',
  torrent: '/ad/torrent/',
  torrentAjax: '/ad/api/torrent.php',
  convert: '/ad/service.php',
  postTorrent: '/torrent/'
};

// these are specific API endpoints for AllDebrid
// @requires http
exports = module.exports = function (http, transformReq) {
  this.checkLogin = function () {
    return http({
      method: 'GET',
      url: api.register,
      responseType: 'document'
    });
  };

  this.fetchUid = function () {
    return http({
      method: 'GET',
      url: api.torrent
    }).then(function (response) {
      return response.data.match(/name="uid" value="(.*)"/)[1];
    });
  };

  this.fetchTorrents = function () {
    return http({
      method: 'GET',
      url: api.torrentAjax,
      params: {
        json: true
      }
    });
  };

  this.removeTorrents = function (id) {
    return http({
      method: 'GET',
      url: api.torrent,
      params: {
        action: 'remove',
        id: id
      }
    });
  };

  this.convert = function (link) {
    return http({
      method: 'GET',
      url: api.convert,
      params: {
        link: link,
        json: true
      }
    });
  };

  this.doLogin = function (username, password) {
    return http({
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
    return http({
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
    return http({
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
};
exports.$inject = ['http', 'transformReq'];
