exports = module.exports = function ($window) {
  // windows 10 registry file will contain this
  var regContent = [
    'Windows Registry Editor Version 5.00\n',
    '[HKEY_CURRENT_USER\\Software\\Classes\\magnet]\n',
    '"URL Protocol"=""\n',
    '@="URL:magnet"\n'
  ];

  this.win10 = $window.navigator.userAgent.indexOf('Windows NT 10.0') !== -1;
  this.blobSupport = false;
  var regBlob, regURL;
  try {
    regBlob = new Blob(regContent, { type : 'text/plain' });
    regURL = $window.URL.createObjectURL(regBlob);
    this.blobSupport = true;
  } catch (e) {}

  this.regeditURL = regURL;

  this.version = process.env.GITREV;
};
exports.$inject = ['$window'];
