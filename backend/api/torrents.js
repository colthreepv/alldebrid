'use strict';

const auth = rootRequire('./util/auth');
const TorrentsUpdater = rootRequire('./util/torrents/torrent-updater');

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

module.exports = [auth.api, streamingTorrents];
