exports = module.exports = function ($http, $q, $timeout, uidFetcher, api) {

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
    var uid = localStorage.getItem('uid.' + user.logoutKey);
    if (uid) { // cache hit
      user.uid = uid;
      return user;
    }

    return api.fetchUid().then(function (uid) {
      localStorage.setItem('uid.' + user.logoutKey, uid);
      user.uid = uid;
      return user;
    });
  }

  // isLogged returns a promise
  this.isLogged = function () {
    return api.checkLogin().then(parseLogin);
  };

  this.login = function (username, password) {
    return api.doLogin(username, password).then(parseLogin);
  };

  this.logout = function (key) {
    return api.doLogout(key).then(parseLogout);
  };

};
exports.$inject = ['$http', '$q', '$timeout', 'uidFetcher', 'adApi'];
