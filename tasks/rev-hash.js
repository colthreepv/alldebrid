'use strict';

var
  path = require('path'),
  stream = require('stream');

var revData = {}; // exposed hash

function trackRevision (file, unused, callback) {
  // console.log(path.relative(file.revOrigBase, file.revOrigPath), '->', path.relative(file.base, file.path));
  revData[path.relative(file.revOrigBase, file.revOrigPath)] = path.relative(file.base, file.path);
  callback(null, file);
}

exports = module.exports = function () {
  var passthrough = new stream.Transform({ objectMode: true });
  passthrough._transform = trackRevision;
  return passthrough;
};
exports.data = revData;
