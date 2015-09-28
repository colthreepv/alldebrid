exports = module.exports = function ($state, user, http, torrent) {
  var self = this;
  this.collapsed = true; // navbar starts collapsed
  this.showMagnet = false;
  this.user = user.status;

  this.ajax = false;
  http.onAjax(function (newStatus) {
    self.ajax = newStatus;
  });

  this.newMagnet = '';
  this.addMagnet = function () {
    torrent.add(self.newMagnet).then(function () {
      self.newMagnet = '';
      self.showMagnet = false;
    });
  };

  this.logout = function () {
    user.logout().then(function () {
      $state.go('login');
    });
  };
};

exports.$inject = ['$state', 'user', 'http', 'torrent'];
