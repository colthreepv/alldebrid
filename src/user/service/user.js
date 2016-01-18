exports = module.exports = function ($http, $q, $timeout, api, storage) {
  var status = this.status = {};

  function parseLogin (response) {
    var page = response.data;
    if (page.querySelector('.login textarea[name="recaptcha_challenge_field"]')) {
      // A wild recaptcha appears
      return $q.reject({ logged: false, recaptcha: true });
    }
    if (page.querySelector('#toolbar span a.toolbar_welcome')) {
      return $q.reject({ logged: false });
    }
    if (page.querySelector('strong a')) {
      var days = page.querySelector('.toolbar_welcome').textContent.match(/in (\d*) days/);
      return attachUid({ // note: attachUid *might* be asynchronous
        logged: true,
        username: page.querySelector('strong a').textContent,
        remainingDays: days ? parseInt(days[1], 10) : 0,
        logoutKey: page.querySelector('.toolbar_disconnect').getAttribute('href').split('key=')[1]
      });
    }
  }

  function parseLogout (response) {
    var page = response.data;
    if (page.querySelector('#toolbar span a.toolbar_welcome')) return $q.resolve();
    return $q.reject();
  }

  // when retrieving details of an user, it misses an unique uid necessary for logout
  // this function helps in that
  function attachUid (user) {
    var uid = storage.get('uid.' + user.logoutKey);
    if (uid) { // cache hit
      user.uid = uid;
      return user;
    }

    return api.fetchUid().then(function (uid) {
      storage.set('uid.' + user.logoutKey, uid);
      user.uid = uid;
      return user;
    });
  }

  // applies `user` to internal status and returns it for reference
  function expose (user) {
    angular.extend(status, user);
    return status;
  }

  // clear status
  function clean () {
    for (var key in status) {
      delete status[key];
    }
  }

  // isLogged returns a promise
  this.isLogged = function () {
    return api.checkLogin().then(parseLogin).then(expose);
  };

  this.login = function (username, password) {
    return api.doLogin(username, password).then(parseLogin).then(expose);
  };

  this.logout = function () {
    return api.doLogout(status.logoutKey).then(parseLogout).then(clean);
  };

};
exports.$inject = ['$http', '$q', '$timeout', 'adApi', 'storage'];
