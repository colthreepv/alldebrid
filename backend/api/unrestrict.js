'use strict';
const Joi = require('joi');

const ad = rootRequire('./ad');
const auth = rootRequire('./util/auth');
const getJar = rootRequire('./util/jar').getJar;
const rp = rootRequire('./components/request');

function unrestrictTorrent (req) {
  const username = req.session.username;
  const links = req.body.links;

  return getJar(username)
  .then(jar => Promise.all(unrestrict(jar, links)));
}
unrestrictTorrent['@validation'] = {
  body: {
    links: Joi.array().items(Joi.string().uri()).min(1).required()
  }
};

function unrestrict (jar, links) {
  return links.map(link => {
    return rp({
      url: ad.convert,
      qs: {
        json: true,
        link
      },
      jar,
      json: true
    }).then(filter);
  });
}

function filter (response) {
  const body = response.body;
  return {
    filename: body.filename,
    size: parseInt(body.filesize, 10),
    link: body.link
  };
}

module.exports = [auth.api, unrestrictTorrent];
