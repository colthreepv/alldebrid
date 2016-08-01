import angular from 'angular';
/* @ngInject */
function Controller ($window, api) {
  this.loginFailed = false;
  this.loginRecaptcha = false;

  this.lgn = {
    username: null,
    password: null
  };
  this.lgnMore = {
    loading: false,
    promise: null // login Promise to handle errors
  };

  // unlock data
  this.unlockToken = false;
  this.unlockBaseInfo = null;
  this.unlockData = {
    unlock_token: null
  };

  this.tryLogin = (form) => {
    if (!form.$valid) return;
    this.lgnMore.loading = true;

    const login = this.lgnMore.promise = api.login(this.lgn.username, this.lgn.password);
    // in case login has been invoked with a return url, it gets triggered now!
    // FIXME parameters
    // if ($stateParams.goTo) $state.go($stateParams.goTo, $stateParams.params);
    return login.then(response => {
      if (response.status === 202) return unlockToken(response.data);
      return redirect(response);
    })
    .catch(err => { err.status === 403 && recaptchaAppeared(); })
    .catch(() => { this.loginFailed = true; })
    .finally(() => this.lgnMore.loading = false);
  };

  this.tryUnlock = (form) => {
    if (!form.$valid) return;
    const payload = angular.extend(this.unlockBaseInfo, { unlock_token: this.unlockData.unlock_token });
    this.lgnMore.loading = true;
    return api.unlock(payload)
    .then(redirect)
    .catch(() => this.loginFailed = true)
    .finally(() => this.lgnMore.loading = false);
  };

  const redirect = (response) => { $window.location.assign(response.data.redirect); };
  const recaptchaAppeared = () => this.loginRecaptcha = true;
  const unlockToken = (response) => {
    this.unlockToken = true;
    this.unlockBaseInfo = {
      username: this.loginData.username,
      pepper: response.pepper,
      geo_unlock: response.geo_unlock,
      salt: response.salt
    };
  };
}

export default {
  name: 'home',
  url: '/login',
  template: require('./index.html'),
  controller: Controller,
  controllerAs: '$ctrl'
};
