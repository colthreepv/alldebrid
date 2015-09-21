exports = module.exports = function ($scope, $stateParams, $state, user) {
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
      // in case login has been invoked with a return url, it gets triggered now!
      if ($stateParams.goTo) $state.go($stateParams.goTo, $stateParams.params);
      else $state.go('home.torrents');
    })
    .catch(function () {
      ctrl.loginFailed = true;
    })
    .finally(function () {
      ctrl.loading = false;
    });
  };

};

exports.$inject = ['$scope', '$stateParams', '$state', 'user'];
