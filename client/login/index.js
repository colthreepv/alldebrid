import angular from 'angular';
/* @ngInject */
function Controller ($window, api, initialState) {
  this.loginFailed = false;
  this.loginRecaptcha = false;

  this.lgn = {
    username: 'mrgamer',
    password: null
  };
  this.lgnMore = {
    loading: false,
    promise: null, // login Promise to handle errors

    recaptcha: !!initialState.recaptcha,
    recaptchaChallenge: null,
    recaptchaValue: null,

    unlock: false, // boolean to activate unlock input
    unlockCode: null,
    unlockBaseInfo: null
  };

  // event fired when recaptcha is detected on page
  this.onRecaptcha = (challenge) => {
    this.lgnMore.recaptcha = true;
    this.lgnMore.recaptchaChallenge = challenge;
  };

  this.tryLogin = (form) => {
    if (!form.$valid) return;
    toggleLoading();

    if (this.lgnMore.recaptcha) return tryRecaptcha();

    // FIXME: do this better
    if (this.lgnMore.unlock) return tryUnlock();

    const login = this.lgnMore.promise = api.login(this.lgn.username, this.lgn.password);
    // in case login has been invoked with a return url, it gets triggered now!
    // FIXME parameters
    // if ($stateParams.goTo) $state.go($stateParams.goTo, $stateParams.params);

    return login.then(response => {
      if (response.status === 202) return unlockToken(response.data);
      return redirect(response.data.redirect);
    })
    // FIXME: review this
    .catch(err => { err.status === 403 && recaptchaAppeared(); })
    .finally(toggleLoading);
  };

  const tryRecaptcha = () => {
    return this.lgnMore.promise = api.loginRecaptcha(
      this.lgn.username,
      this.lgn.password,
      this.lgnMore.recaptchaChallenge,
      this.lgnMore.recaptchaValue).finally(toggleLoading);
  };

  const tryUnlock = () => {

    const payload = angular.extend(this.lgnMore.unlockBaseInfo, { unlock_token: this.lgnMore.unlockCode });
    const unlock = this.lgnMore.promise = api.unlock(payload);
    return unlock.then(response => redirect(response.data.redirect))
    .finally(toggleLoading);
  };

  const redirect = (url) => $window.location.assign(url);
  const recaptchaAppeared = () => { this.loginRecaptcha = true; };
  const unlockToken = (data) => {
    this.lgnMore.unlock = true;
    this.lgnMore.unlockBaseInfo = {
      username: this.lgn.username,
      pepper: data.pepper,
      geo_unlock: data.geo_unlock,
      salt: data.salt
    };
  };

  const toggleLoading = () => this.lgnMore.loading = !this.lgnMore.loading;
}

export default {
  name: 'home',
  url: '/login',
  template: require('./index.html'),
  controller: Controller,
  controllerAs: '$ctrl'
};
