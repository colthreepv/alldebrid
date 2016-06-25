function Controller (user, api, http) {
  this.collapsed = true; // navbar starts collapsed
  this.showMagnet = false;
  this.user = user;

  this.loggingOut = false;

  this.ajax = false;
  http.onAjax(newStatus => this.ajax = newStatus);

  this.newMagnet = '';
  this.addMagnet = addMagnet.bind(this);
  function addMagnet () {
    torrent.add(this.newMagnet).then(function () {
      this.newMagnet = '';
      this.showMagnet = false;
    });
  }

  this.logout = logout.bind(this);
  function logout () {
    this.loggingOut = true;
    api.logout()
    .then(() => location.assign('/login'))
    .finally(() => this.loggingOut = false);
  }
}
export default {
  template: require('./index.html'),
  controller: Controller,
  controllerAs: '$ctrl'
};
