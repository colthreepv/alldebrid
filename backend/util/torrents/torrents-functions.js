'use strict';

const errorCodes = rootRequire('./components/error-codes');
const ad = rootRequire('./ad');
const rp = rootRequire('./components/request');
const storage = rootRequire('./components/storage');
const makeJar = rootRequire('./util/make-jar');
const parse = rootRequire('./util/torrents/parse-utils');

const err = {
  noCookies: errorCodes.add(1010, 'cookies not found for such user')
};

// returns cached torrents or fetches them
function getTorrents (username) {
  return storage.getTorrents(username)
  .catch(storage.NotFoundError, () => fetchTorrents(username))
  .tap(torrents => storage.setTorrents(username, torrents));
}

// always fetches torrents
function fetchTorrents (username) {
  console.log('requesting torrents list');
  return storage.getCookies(username)
  .catch(storage.NotFoundError, () => { throw err.noCookies().hc(500).debug(username); })
  .then(makeJar)
  .then(jar => {
    return rp({
      url: ad.torrentAjax,
      qs: {
        json: true
      },
      jar,
      json: true
    });
  })
  .then(response => parseTorrents(response.body));
}

function parseTorrents (torrentJson) {
  // in case API responds with non-valid Array means we logged off or something bad happened, stopping forever loop
  if (!Array.isArray(torrentJson)) return [];
  return torrentJson.map(function (torrent) {
    const torrentID = parseInt(torrent[1], 10);

    const seeds = parseInt(torrent[7], 10);
    const newTorrent = {
      id: torrentID,
      server: parseInt(torrent[2], 10),
      name: torrent[3].slice(31, -7),
      status: parse.status(torrent[4]),
      downloaded: parse.size(torrent[5]),
      size: parse.size(torrent[6]),
      seeder: Number.isNaN(seeds) ? 0 : seeds,
      speed: parse.speed(torrent[8]),
      'added_date': parse.date(torrent[9]),
      links: parse.links(torrent[10])
    };

    return newTorrent;
  });
}

function hasActiveTorrents (torrents) {
  return torrents.some(torrent => torrent.status === 'downloading' || torrent.status === 'uploading');
}

module.exports = {
  get: getTorrents,
  fetch: fetchTorrents,
  hasActive: hasActiveTorrents
};
