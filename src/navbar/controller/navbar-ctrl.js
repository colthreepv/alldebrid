exports = module.exports = function ($state, user, api) {
  var self = this;
  this.collapsed = true; // navbar starts collapsed
  this.user = user.status;

  this.ajax = false;
  api.onAjax(function (newStatus) {
    self.ajax = newStatus;
  });

  this.newMagnet = '';
  this.addMagnet = function () {
    console.info('Yet TBD!', self.newMagnet);
  };

  this.logout = function () {
    user.logout().then(function () {
      $state.go('login');
    });
  };
};

exports.$inject = ['$state', 'user', 'adApi'];
