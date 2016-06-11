const template = `
<div class="navbar navbar-default" ng-class="navbar.ajax && 'psycload'" role="navigation">
  <div class="navbar-header">
    <button type="button" class="navbar-toggle btn btn-default" ng-click="navbar.logout()">Logout <span class="glyphicon glyphicon-log-out"></span></button>
    <button type="button" class="navbar-toggle collapsed" ng-click="navbar.collapsed = !navbar.collapsed">
      <span class="sr-only">Toggle navigation</span>
      <span class="icon-bar"></span>
      <span class="icon-bar"></span>
      <span class="icon-bar"></span>
      <span class="icon-bar"></span>
    </button>
    <a class="navbar-brand" href="#" ui-sref="home.torrents" ng-show="!navbar.ajax">AllDebrid</a>
    <a class="navbar-brand" href="#" ui-sref="home.torrents" ng-show="navbar.ajax">Loading</a>
  </div>
  <form name="addMagnet" ng-submit="navbar.addMagnet()">
    <div class="collapse navbar-collapse" ng-class="!navbar.collapsed && 'in'">
      <div class="pull-right">
        <button type="button" class="btn btn-default navbar-btn"
          ng-click="navbar.showMagnet = !navbar.showMagnet"
          ng-show="navbar.newMagnet.length === 0">New</button>
        <button type="button" class="btn btn-default navbar-btn"
          ng-click="navbar.showMagnet = !navbar.showMagnet"
          ng-show="navbar.showMagnet && navbar.newMagnet.length === 0">Close</button>
        <button type="submit" class="btn btn-warning navbar-btn"
          ng-show="navbar.newMagnet.length > 0">Add</button>

        <span class="navbar-brand">
          <span class="glyphicon glyphicon-user"></span>
          <span class="right-spacer">{{ navbar.user.username }}</span>
        </span>
        <span class="navbar-brand">
          <span ng-show="navbar.user.remainingDays">days left: {{ navbar.user.remainingDays }}</span>
          <span ng-show="!navbar.user.remainingDays">no days left</span>
          <a href="http://www.alldebrid.com/offer/" target="_blank" ng-show="!navbar.user.remainingDays">renew</a>
        </span>
        <button type="button" class="btn btn-default navbar-btn pull-right hidden-xs" ng-click="navbar.logout()">Logout <span class="glyphicon glyphicon-log-out"></span></button>
      </div>
    </div>
    <div class="add-magnet" ng-show="navbar.showMagnet">
      <input type="text" class="form-control long-text" name="magnet" placeholder="new magnet" autofocus ng-model="navbar.newMagnet">
    </div>
  </form>
</div>
`;

function Controller ($state, http) {
  var $ctrl = this;

  this.collapsed = true; // navbar starts collapsed
  this.showMagnet = false;

  this.ajax = false;
  http.onAjax(function (newStatus) {
    $ctrl.ajax = newStatus;
  });
}
Controller.$inject = ['$state', 'http'];

export default {
  url: '',
  template,
  controller: Controller
};
