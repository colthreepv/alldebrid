'use strict';
import { flow } from 'jsonpipe';

const api = {
  login: '/api/login/',
  logout: '/api/logout/',
  unlock: '/api/unlock',
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

  return { login, unlock, logout, torrents };
}
apiFactory.$inject = ['http'];
export default apiFactory;
