'use strict';
const api = {
  login: '/api/login/',
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

  return { login, unlock };
}
apiFactory.$inject = ['http'];
export default apiFactory;
