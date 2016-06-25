'use strict';
exports = module.exports = function (errorCodes, ad, rp, storage, makeJar, parse) {

  const err = {
    noCookies: errorCodes.add(1010, 'cookies not found for such user')
  };

  function fetchTorrents (username) {
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

  return fetchTorrents;

  function parseTorrents (torrentJson) {
    // in case API responds with non-valid Array means we logged off or something bad happened, stopping forever loop
    if (!Array.isArray(torrentJson)) throw new Error('torrents API responded with a non-valid Array structure');
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
};

exports['@singleton'] = true;
exports['@require'] = [
  'components/error-codes',
  'ad',
  'components/request',
  'components/storage',
  'util/make-jar',
  'util/parse-utils'
];
