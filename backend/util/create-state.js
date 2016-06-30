'use strict';
const assign = require('assign-deep');

const torrents = rootRequire('./util/torrents/torrents-functions');

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

module.exports = createState;
