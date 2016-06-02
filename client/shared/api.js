'use strict';
const api = {
  login: '/api/login/'
};

function apiFactory (http) {

  function login (username, password) {
    return http({
      method: 'POST',
      url: api.login,
      data: { username, password }
    });
  }

  return { login };
}
apiFactory.$inject = ['http'];

export default apiFactory;
