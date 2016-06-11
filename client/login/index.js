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

  this.loginData = {
    username: null,
    password: null
  };

  this.fields = [
    {
      key: 'username',
      type: 'input',
      wrapper: 'errors',
      templateOptions: {
        placeholder: 'Username',
        required: true,
        minlength: 3,
        addonLeft: {
          class: 'glyphicon glyphicon-user'
        }
      }
    },
    {
      key: 'password',
      type: 'input',
      wrapper: 'errors',
      templateOptions: {
        type: 'password',
        placeholder: 'password',
        required: true,
        minlength: 3,
        addonLeft: {
          class: 'glyphicon glyphicon-lock'
        }
      }
    }
  ];

  function tryLogin (form) {
    if (!form.$valid) return;
    $ctrl.loading = true;
    return api.login($ctrl.loginData.username, $ctrl.loginData.password)
    // in case login has been invoked with a return url, it gets triggered now!
    // FIXME parameters
    // if ($stateParams.goTo) $state.go($stateParams.goTo, $stateParams.params);
    .then(() => $location.path('/'))
    .catch(err => err.status === 403 && recaptchaAppeared())
    .catch(() => this.loginFailed = true)
    .finally(() => this.loading = false);
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
