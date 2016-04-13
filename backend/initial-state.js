'use strict';
const generator = require('../src/modules/id-generator').default;

const firstTorrent = {
  key: generator(),
  name: 'First bad torrent'
};

const fakeTorrents = {
  list: [firstTorrent],
  byId: {}
};
fakeTorrents.byId[firstTorrent.key] = firstTorrent;


const initial = {
  torrents: fakeTorrents
};

module.exports = initial;
