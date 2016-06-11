import angular from 'angular';

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
  this.unlockToken = false;

  this.tryLogin = tryLogin;
  this.tryUnlock = tryUnlock;

  this.loginData = {
    username: null,
    password: null
  };

  this.loginFields = [
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

  this.unlockBaseInfo = null;
  this.unlockData = {
    unlock_token: null
  };

  this.unlockFields = [
    {
      key: 'unlock_token',
      type: 'input',
      wrapper: 'errors',
      templateOptions: {
        placeholder: 'Unlock Token',
        required: true,
        minlength: 6,
        maxlength: 8,
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
    .then(response => {
      if (response.status === 202) return unlockToken(response.data);
      return redirect(response);
    })
    .catch(err => err.status === 403 && recaptchaAppeared())
    .catch(() => this.loginFailed = true)
    .finally(() => this.loading = false);
  }

  function tryUnlock (form) {
    if (!form.$valid) return;
    const payload = angular.extend($ctrl.unlockBaseInfo, { unlock_token: $ctrl.unlockData.unlock_token });
    $ctrl.loading = true;
    return api.unlock(payload)
    .then(redirect)
    .catch(() => this.loginFailed = true)
    .finally(() => this.loading = false);
  }

  function redirect (response) { $location.path(response.data.redirect); }
  function recaptchaAppeared () { $ctrl.loginRecaptcha = true; }

  function unlockToken (response) {
    $ctrl.unlockToken = true;
    $ctrl.unlockBaseInfo = {
      username: $ctrl.loginData.username,
      pepper: response.pepper,
      geo_unlock: response.geo_unlock,
      salt: response.salt
    };
  }
}
Controller.$inject = ['api', '$location'];

export default {
  url: '',
  template: require('./index.html'),
  controller: Controller,
  controllerAs: '$ctrl'
};
