exports = module.exports = function ($window, $location) {
  var navigator = $window.navigator;
  var port = $location.port() === 80 ? '' : ':' + $location.port();
  var appUrl = $location.protocol() + '://' + $location.host() + port + '/#!/add/%s';

  navigator.registerProtocolHandler('magnet', appUrl, 'Magnet handler');
};
exports.$inject = ['$window', '$location'];
