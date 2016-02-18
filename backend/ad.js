'use strict';
const url = require('url');
const PREFIX = 'https://www.alldebrid.com';

module.exports = {
  base: PREFIX,
  register: url.resolve(PREFIX, '/register/'),
  torrent: url.resolve(PREFIX, '/torrent/'),
  torrentAjax: url.resolve(PREFIX, '/api/torrent.php'),
  convert: url.resolve(PREFIX, '/service.php'),
  postTorrent: 'https://upload.alldebrid.com/uploadtorrent.php'
};
