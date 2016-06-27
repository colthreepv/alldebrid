'use strict';

const LONG_TIME = 10 * 1000;
const SHORT_TIME = 4 * 1000;

exports = module.exports = function (torrents, storage) {
  class TorrentsUpdater {
    constructor (username, sendFn) {
      this.username = username;
      this.sendFn = sendFn;
      this.updateEvery = null;
      this.intervalId = null;
      this.active = false;

      this.startLoop(SHORT_TIME);
    }

    startLoop (updateEvery) {
      this.intervalId = setInterval(() => this.fetchAndReply(), updateEvery);
      this.updateEvery = updateEvery;
      this.active = true;
      return this;
    }

    fetchAndReply () {
      return torrents.fetch(this.username)
      .tap(torrents => storage.setTorrents(this.username, torrents))
      .tap(this.sendFn)
      // checks if there is an active torrent
      .then(torrents.hasActive)
      // in case the updateEvery is not appropriate, it triggers a change
      .then(hasActive => {
        if (
          this.updateEvery === LONG_TIME && hasActive ||
          this.updateEvery === SHORT_TIME && !hasActive
        ) this.changeRefreshTime();
      });
    }

    changeRefreshTime () {
      if (!this.active) return this;
      console.log('changing refresh time. Actual:', this.updateEvery);
      this.stop();
      if (this.updateEvery === SHORT_TIME) this.startLoop(LONG_TIME);
      else this.startLoop(SHORT_TIME);
      return this;
    }

    stop () {
      clearInterval(this.intervalId);
      this.active = false;
      return this;
    }
  }

  return TorrentsUpdater;
};
exports['@singleton'] = true;
exports['@require'] = [
  'util/torrents/torrents-functions',
  'components/storage'
];
