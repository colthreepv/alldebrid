// external parsing functions
var parse = require('./_parse-functions');
exports = module.exports = function ($timeout, $q, api, user) {
  var loopForever = true;
  var cooldownTimer = 5000;
  var db = this.db = [];
  var hash = this.hash = {};

  function parseTorrents (response) {
    // in case API responds with non-valid Array means we logged off or something bad happened, stopping forever loop
    if (!angular.isArray(response.data)) return loopForever = false;
    response.data.forEach(function (torrent) {
      var torrentID = parseInt(torrent[1], 10);

      var newTorrent, torrentPtr, seeds;

      // if exists, replace
      if (torrentPtr = hash[torrentID], torrentPtr !== undefined) {
        newTorrent = {
          id: torrentID,
          server: parseInt(torrent[2], 10),
          name: torrent[3].slice(31, -7),
          status: parse.status(torrent[4]),
          downloaded: torrent[5],
          size: parse.size(torrent[6]),
          seeder: (seeds = parseInt(torrent[7], 10), !isNaN(seeds)) ? seeds : 0,
          speed: parse.speed(torrent[8]),
          'added_date': parse.date(torrent[9]),
          links: parse.links(torrent[10])
        };

        for (var attrName in torrentPtr) {
          // in case the links array differ in length
          if (attrName === 'links' && torrentPtr[attrName].length !== newTorrent[attrName].length) {
            torrentPtr[attrName] = newTorrent[attrName]; // discard previous links list
          }
          if (
            attrName !== '$$hashKey' &&
            attrName !== 'added_date' &&
            attrName !== 'checked' &&
            attrName !== 'links' &&
            torrentPtr[attrName] !== newTorrent[attrName]) {

            console.log('something differs:', torrentPtr[attrName], newTorrent[attrName]);
            torrentPtr[attrName] = newTorrent[attrName];
          }
        }
      } else { // else add
        newTorrent = {
          id: torrentID,
          server: parseInt(torrent[2], 10),
          name: torrent[3].slice(31, -7),
          status: parse.status(torrent[4]),
          downloaded: torrent[5],
          size: parse.size(torrent[6]),
          seeder: parseInt(torrent[7], 10),
          speed: parse.speed(torrent[8]),
          'added_date': parse.date(torrent[9]),
          links: parse.links(torrent[10])
        };
        db.push(newTorrent);

        hash[torrentID] = newTorrent;
      }
    });
  }

  function await () {
    return $timeout(cooldownTimer);
  }

  function forever () {
    if (!loopForever) return;
    api.fetchTorrents().then(parseTorrents).then(await).then(forever);
  }

  function add (link) {
    return api.addTorrent(link, user.status.uid);
  }

  /**
   * remove torrents passed in input
   * @param  {Array} list of torrent IDs to be removed, even if 1, it must be encased in array
   * @return {Promise} => undefined useful to track completion
   */
  function remove (list) {
    if (!list.length) return $q.resolve();
    var firstTorrent = list[0];

    return api.removeTorrents(firstTorrent.id).then(function () {
      var idx;
      // cleaning data structures
      if (idx = list.indexOf(firstTorrent), idx !== -1) list.splice(idx, 1);
      else console.log('missing splice, why?');
      if (idx = db.indexOf(firstTorrent), idx !== -1) db.splice(idx, 1);
      else console.log('missing splice, why?');
      delete hash[firstTorrent.id];
    }).then(remove.bind(null, list));
  }

  this.add = add;
  this.remove = remove;

  // start forever loop here
  this.start = function () {
    loopForever = true;
    forever();
  };

  this.stop = function () {
    loopForever = false;
  };
};
exports.$inject = ['$timeout', '$q', 'adApi', 'user'];
