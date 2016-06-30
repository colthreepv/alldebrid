'use strict';
const Joi = require('joi');

const ad = rootRequire('./ad');
const auth = rootRequire('./util/auth');
const getJar = rootRequire('./util/jar').getJar;
const rp = rootRequire('./components/request');

function removeTorrent (req) {
  const username = req.session.username;
  const torrents = req.body.torrents;

  return getJar(username)
  .then(jar => Promise.all(remove(jar, torrents)).return({ status: 'ok' }));
}
removeTorrent['@validation'] = {
  body: {
    torrents: Joi.array().items(Joi.number()).min(1).required()
  }
};

function remove (jar, torrents) {
  return torrents.map(torrent => {
    return rp({
      url: ad.torrent,
      qs: {
        action: 'remove',
        id: torrent
      },
      jar,
      json: true
    });
  });
}

module.exports = [auth.api, removeTorrent];
