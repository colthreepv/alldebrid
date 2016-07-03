/* @ngInject */
function magnet ($window, $location, storage) {
  var navigator = $window.navigator;
  var port = $location.port() === 80 ? '' : ':' + $location.port();
  var appUrl = $location.protocol() + '://' + $location.host() + port + '/#!/add/%s';
  var isWin10 = $window.navigator.userAgent.indexOf('Windows NT 10.0') !== -1;
  var applicable = isWin10 && storage.get('win10-notification') === 'hide';

  return { boot, register };

  function register () {
    navigator.registerProtocolHandler('magnet', appUrl, 'Magnet handler');
  }

  function boot () {
    try {
      if (isWin10) {
        if (applicable) register();
      } else {
        register();
      }
    } catch (e) {}
  }
}
export default magnet;
