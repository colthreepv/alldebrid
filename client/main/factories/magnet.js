/* @ngInject */
function magnet ($window, $location, storage) {
  const navigator = $window.navigator;
  const needsPort = !($location.port() === 80 || ($location.port() === 443 && $location.protocol() === 'https'));
  const port = needsPort ? `:${$location.port()}` : '';
  const appUrl = `${$location.protocol()}://${$location.host()}${port}/add/%s`;
  const isWin10 = $window.navigator.userAgent.indexOf('Windows NT 10.0') !== -1;
  const applicable = isWin10 && storage.get('win10-notification') === 'hide';

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
