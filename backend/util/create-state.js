'use strict';

const assign = require('assign-deep');

exports = module.exports = function (torrents) {

  function createState (reqSession) {

    console.log('session', { uid: reqSession.uid, username: reqSession.username });
    return torrents.get(reqSession.username)
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
  'util/torrents/torrents-functions'
];
