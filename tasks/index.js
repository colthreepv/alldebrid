'use strict';
let
  path = require('path'),
  fs = require('fs');

fs.readdirSync(__dirname)
.filter(function (file) {
  return (file.endsWith('.js') && file !== 'index.js');
})
.map(function (file) {
  if (fs.statSync(path.join(__dirname, file)).isDirectory()) return file;
  return file.slice(0, -3); // remove '.js' extension, if is a file
}).forEach(function (file) {
  exports[file] = require('./' + file);
});
