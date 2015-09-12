exports = module.exports = function ($state, user, api) {
  var self = this;
  this.collapsed = true; // navbar starts collapsed
  this.user = user.status;

  this.ajax = false;

  this.page = function () {
    return $state.current.name;
  };

  api.onAjax(function (newStatus) {
    self.ajax = newStatus;
  });

  this.logout = function () {
    user.logout().then(function () {
      $state.go('login');
    });
  };
};

exports.$inject = ['$state', 'user', 'adApi'];
