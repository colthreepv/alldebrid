'use strict';
import { flow } from 'jsonpipe';

const api = {
  login: '/api/login/',
  logout: '/api/logout/',
  unlock: '/api/unlock',
  unrestrict: '/api/unrestrict',
  torrents: '/api/torrents'
};

function apiFactory (http) {

  function login (username, password) {
    return http({
      method: 'POST',
      url: api.login,
      data: { username, password }
    });
  }

  function unlock (data) {
    return http({
      method: 'POST',
      url: api.unlock,
      data
    });
  }


  function logout () {
    return http({
      method: 'POST',
      url: api.logout
    });
  }

  function torrents (success, error, complete) {
    flow('/api/torrents', { delimiter: '\n\n', success, error, complete });
  }

  function addTorrents (links) {
    return http({
      method: 'POST',
      url: api.torrents,
      data: { links }
    });
  }

  function unrestrict (links) {
    return http({
      method: 'POST',
      url: api.unrestrict,
      data: { links }
    });
  }

  function removeTorrents (torrents) {
    return http({
      method: 'DELETE',
      url: api.torrents,
      data: { torrents }
    });
  }

  return {
    login,
    unlock,
    logout,
    addTorrents,
    removeTorrents,
    torrents,
    unrestrict
  };
}

export default apiFactory;
