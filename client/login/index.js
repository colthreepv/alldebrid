/* @ngInject */
function Controller ($window, $interval, api) {
  this.loginFailed = false;
  this.loginRecaptcha = false;

  this.lgn = {
    username: 'mrgamer',
    password: null
  };
  this.lgnMore = {
    connecting: false,
    promise: null, // login Promise to handle errors

    unlock: false, // boolean to activate unlock input
    unlockCode: null,
    unlockBaseInfo: null
  };

  this.connect = () => {
    toggleLoading();
    const connectWnd = $window.open('/ad/', 'connectWnd', 'resizable,status,width=980,height=800');


    const checkPopup = $interval(() => {
      try {
        if (connectWnd && connectWnd.closed) popupClosed();
      } catch (e) {}
    }, 100);

    const popupClosed = () => {
      $interval.cancel(checkPopup); // stop looping, please!
      toggleLoading();
    };
  };

  const toggleLoading = () => this.lgnMore.connecting = !this.lgnMore.connecting;
}

export default {
  name: 'home',
  url: '/login',
  template: require('./index.html'),
  controller: Controller,
  controllerAs: '$ctrl'
};
