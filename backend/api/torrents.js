'use strict';

exports = module.exports = function (TorrentsUpdater, auth) {

  function streamingTorrents (req, res) {
    const username = req.session.username;

    res.set('Transfer-Encoding', 'chunked');
    res.type('json');

    const updater = new TorrentsUpdater(username, send);

    res.on('close', () => updater.stop());
    function send (json) {
      res.write(JSON.stringify(json) + '\n\n');
    }
  }
  streamingTorrents['@raw'] = true;

  return [auth.api, streamingTorrents];

};
exports['@singleton'] = true;
exports['@require'] = [
  'util/torrents/torrent-updater',
  'util/auth'
];
