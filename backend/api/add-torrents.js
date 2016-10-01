'use strict';
const Joi = require('joi');

const ad = rootRequire('./ad');
const auth = rootRequire('./util/auth');
const getJar = rootRequire('./util/jar').getJar;
const rp = rootRequire('./components/request');

// this can be invoked also as a stand-alone function
function addTorrents (req, injectedLinks) {
  const username = req.session.username;
  const uid = req.session.uid;
  const links = injectedLinks || req.body.links;

  return getJar(username)
  .then(jar => Promise.all(add(jar, uid, links)).return({ status: 'ok' }));
}
addTorrents['@validation'] = {
  body: {
    links: Joi.array().items(Joi.string().regex(/magnet:\?xt=urn:[a-z0-9]+:[a-z0-9]{32}/i)).min(1).required()
  }
};

function add (jar, uid, links) {
  return links.map(link => {
    return rp({
      url: ad.postTorrent,
      method: 'POST',
      form: {
        domain: ad.torrent,
        uid,
        magnet: link,
        quick: '1'
      },
      jar
    });
  });
}

module.exports = [auth.api, addTorrents];
module.exports.addTorrents = addTorrents;
