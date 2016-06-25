function Controller (user, api, http) {
  var $ctrl = this;
  this.collapsed = true; // navbar starts collapsed
  this.showMagnet = false;
  this.user = user;

  $ctrl.loggingOut = false;

  this.ajax = false;
  http.onAjax(function (newStatus) {
    $ctrl.ajax = newStatus;
  });

  this.newMagnet = '';
  this.addMagnet = function () {
    torrent.add($ctrl.newMagnet).then(function () {
      $ctrl.newMagnet = '';
      $ctrl.showMagnet = false;
    });
  };

  this.logout = logout;
  function logout () {
    $ctrl.loggingOut = true;
    api.logout()
    .then(() => location.assign('/login'))
    .finally(() => $ctrl.loggingOut = false);
  }
}
export default {
  template: require('./index.html'),
  controller: Controller,
  controllerAs: '$ctrl'
};
