'use strict';
const api = {
  login: '/api/login/',
  logout: '/api/logout/',
  unlock: '/api/unlock'
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

  return { login, unlock, logout };
}
apiFactory.$inject = ['http'];
export default apiFactory;
