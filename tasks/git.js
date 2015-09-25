'use strict';

let git = require('git-rev');

function readGitRev (done) {
  git.short(function (rev) {
    process.env.GITREV = rev;
    done();
  });
}

module.exports = readGitRev;
