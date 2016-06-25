'use strict';

const assign = require('assign-deep');

exports = module.exports = function (fetchTorrents) {

  function createState (reqSession) {

    console.log('session', { uid: reqSession.uid, username: reqSession.username });
    return fetchTorrents(reqSession.username)
    .then(torrents => {
      return assign({}, { torrents }, {
        uid: reqSession.uid,
        username: reqSession.username,
        user: reqSession.user
      });
    });
  }

  return createState;
};
exports['@singleton'] = true;
exports['@require'] = [
  'util/parse-torrents'
];
