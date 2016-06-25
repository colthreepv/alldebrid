'use strict';

function replyUser (req, login) {
  req.session.uid = login.uid;
  req.session.username = login.username;
  req.session.user = {};
  for (const key in login) {
    req.session.user[key] = login[key];
  }

  return { status: 'ok', redirect: `${req.protocol}://${req.headers.host}/` };
}

exports.replyUser = replyUser;
