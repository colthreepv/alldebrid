exports = module.exports = function ($scope, $state, user) {
  var ctrl = this;

  // login functions
  $scope.login = {};

  $scope.loading = false;

  this.username = null;
  this.password = null;
  this.loading = false;
  this.loginFailed = false;

  this.do = function () {
    ctrl.loading = true;
    user.login(ctrl.username, ctrl.password)
    .then(function () {
      $state.go('home.torrents');
    })
    .catch(function () {
      ctrl.loginFailed = true;
    })
    .finally(function () {
      ctrl.loading = false;
    });
  };

};

exports.$inject = ['$scope', '$state', 'user'];
