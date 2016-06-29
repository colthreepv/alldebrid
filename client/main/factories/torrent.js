import EventEmitter from 'eventemitter3';

const REBOOT_COOLDOWN = 2000;

function torrentList ($window, $rootScope, api) {
  if (
    $window.STATE_FROM_SERVER == null ||
    $window.STATE_FROM_SERVER.torrents == null
  ) throw new Error('page should have STATE_FROM_SERVER at runtime');

  const tee = new EventEmitter(); // torrent-event-emitter
  tee.first = first;

  start();

  return tee;
  function first () { return $window.STATE_FROM_SERVER.torrents; }
  function start () {
    api.torrents(
      torrents => $rootScope.$evalAsync(() => tee.emit('update', torrents)),
      error => $rootScope.$evalAsync(() => tee.emit('error', error)),
      () => setTimeout(start, REBOOT_COOLDOWN)
    );
  }
}
export default torrentList;
