exports = module.exports = function ($state, user) {
  this.page = function () {
    return $state.current.name;
  };

  this.user = user.status;
  this.logout = function () {
    user.logout().then(function () {
      $state.go('login');
    });
  };
};

exports.$inject = ['$state', 'user'];
