function Controller (api, $location) {
  var $ctrl = this;

  // login functions
  this.login = {};

  this.loading = false;

  this.username = null;
  this.password = null;
  this.loading = false;
  this.loginFailed = false;
  this.loginRecaptcha = false;

  this.tryLogin = tryLogin;
  this.invalidForm = invalidForm;

  function tryLogin () {
    $ctrl.loading = true;
    return api.login($ctrl.username, $ctrl.password)
    // in case login has been invoked with a return url, it gets triggered now!
    // FIXME parameters
    // if ($stateParams.goTo) $state.go($stateParams.goTo, $stateParams.params);
    .then(() => $location.path('/'))
    .catch(err => err.status === 403 && recaptchaAppeared())
    .catch(() => this.loginFailed = true)
    .finally(() => this.loading = false);
  }

  function invalidForm (form) {
    return form.$pristine ||
      (form.$pristine && !form.$valid);
  }

  function recaptchaAppeared () {
    $ctrl.loginRecaptcha = true;
  }
}
Controller.$inject = ['api', '$location'];

export default {
  url: '',
  template: require('./index.html'),
  controller: Controller,
  controllerAs: '$ctrl'
};
