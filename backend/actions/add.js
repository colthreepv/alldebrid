'use strict';
const auth = rootRequire('./util/auth');
const addTorrents = rootRequire('./api/add-torrents').addTorrents;

const MAGNET_REGEX = /magnet:\?xt=urn:[a-z0-9]+:[a-z0-9]{32}/i;

function redirectToHome (req, res, next) {
  res.redirect('/');
}
redirectToHome['@raw'] = true;

function fastAdd (req) {
  const magnet = req.url.substr(5);

  if (magnet.match(MAGNET_REGEX)) return addTorrents(req, [magnet]);
  return Promise.resolve();
}

module.exports = [auth.api, fastAdd, redirectToHome];
