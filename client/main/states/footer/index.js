/* @ngInject */
function Controller ($window, storage, magnet) {
  this.version = process.env.GIT_REV;

  // from here on, there's only logic for the reg
  // windows 10 registry file will contain this
  const regContent = `
    Windows Registry Editor Version 5.00
    [HKEY_CURRENT_USER\\Software\\Classes\\magnet]
    "URL Protocol"=""
    @="URL:magnet"
  `;

  this.win10 = $window.navigator.userAgent.indexOf('Windows NT 10.0') !== -1;
  this.win10Hide = storage.get('win10-notification') === 'hide' ? true : false;
  this.win10Done = win10Done;
  this.blobSupport = false;
  let regBlob, regURL;
  try {
    regBlob = new Blob(regContent, { type : 'text/plain' });
    regURL = $window.URL.createObjectURL(regBlob);
    this.blobSupport = true;
  } catch (e) {}

  this.regeditURL = regURL;

  function win10Done () {
    storage.set('win10-notification', 'hide');
    this.win10Hide = true;
    magnet.register();
  }
}
export default {
  template: require('./index.html'),
  controller: Controller,
  controllerAs: '$ctrl'
};
