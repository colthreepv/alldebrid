function isLogged ($state, $q, user) {
  if (user.status.logged) return $q.resolve();
  return user.isLogged().catch(function () {
    return $state.go('login');
  });
}
isLogged.$inject = ['$state', '$q', 'user'];

function startTorrents (torrent) {
  return torrent.start();
}
startTorrents.$inject = ['torrent'];

function addMagnet ($stateParams, $state, $q, $timeout, torrent, user) {
  // in case user has already logged before
  if (user.status.logged) {
    return torrent.add($stateParams.magnet).then($state.go.bind(null, 'home.torrents', {}, { location: 'replace' }));
  }

  // otherwise logs in and then adds
  return user.isLogged().then(function () {
    return torrent.add($stateParams.magnet).then($state.go.bind(null, 'home.torrents', {}, { location: 'replace' }));
  }).catch(function () {
    $state.go('login', {
      goTo: 'home.add-external',
      params: $stateParams
    });
  });
}
addMagnet.$inject = ['$stateParams', '$state', '$q', '$timeout', 'torrent', 'user'];

exports.isLogged = isLogged;
exports.startTorrents = startTorrents;
exports.addMagnet = addMagnet;
