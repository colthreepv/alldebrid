const template = `<div class="row login">
  <div class="col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3">
    <div class="panel panel-default">
      <div class="panel-heading">
        <strong>Alldebrid Login</strong>
      </div>
      <div class="panel-body">
        <form role="form" ng-submit="$ctrl.tryLogin()">
          <fieldset>
            <div class="row">
              <div class="center-block">
                <img class="profile-img" src="//cdn.alldebrid.com/lib/images/default/logo_alldebrid.png">
              </div>
            </div>
            <div class="row">
              <div class="col-sm-12 col-md-10  col-md-offset-1">
                <div class="form-group">
                  <div class="input-group">
                    <span class="input-group-addon">
                      <i class="glyphicon glyphicon-user"></i>
                    </span>
                    <input class="form-control" placeholder="Username" name="loginname" type="text" autofocus ng-model="$ctrl.username" ng-change="$ctrl.loginFailed = false">
                  </div>
                </div>
                <div class="form-group">
                  <div class="input-group">
                    <span class="input-group-addon">
                      <i class="glyphicon glyphicon-lock"></i>
                    </span>
                    <input class="form-control" placeholder="Password" name="password" type="password" ng-model="$ctrl.password" ng-change="$ctrl.loginFailed = false">
                  </div>
                </div>
                <div class="form-group">
                </div>
                <div class="alert alert-danger" ng-show="$ctrl.loginFailed">
                  <strong>Error!</strong> Change username/password and try submitting again.
                </div>
                <div class="form-group">
                  <button type="submit" class="btn btn-lg btn-primary" ng-disabled="$ctrl.loading || $ctrl.loginFailed">Log In</button>
                  <button class="btn btn-lg btn-primary" ng-show="$ctrl.loading"><span class="glyphicon glyphicon-refresh glyphicon-spin"></span></button>
                </div>
              </div>
            </div>
          </fieldset>
        </form>
      </div>
      <div class="panel-footer">
        Don't have an account? <a href="https://www.alldebrid.com/register/" target="_blank">Register on AllDebrid</a>
      </div>
    </div>
  </div>
</div>`;

function Controller (api, $location, $document) {
  var $ctrl = this;

  // login functions
  this.login = {};

  this.loading = false;

  this.username = null;
  this.password = null;
  this.loading = false;
  this.loginFailed = false;

  this.tryLogin = tryLogin;

  function tryLogin () {
    $ctrl.loading = true;
    return api.login($ctrl.username, $ctrl.password)
    // in case login has been invoked with a return url, it gets triggered now!
    // FIXME parameters
    // if ($stateParams.goTo) $state.go($stateParams.goTo, $stateParams.params);
    .then(() => $location.path('/'))
    .catch(err => err.status === 403 && putCaptcha())
    .catch(() => this.loginFailed = true)
    .finally(() => this.loading = false);
  }

  function putCaptcha () {
    const doc = $document[0];
    const scriptEl = doc.createElement('script');
    scriptEl.src = '//www.google.com/recaptcha/api/challenge?k=6LefUggAAAAAAOHuFwFo8P3jVsPiVLF5IkSP9pCN';
    doc.head.appendChild(scriptEl);
  }
}
Controller.$inject = ['api', '$location', '$document'];

export default {
  url: '',
  template,
  controller: Controller,
  controllerAs: '$ctrl'
};
