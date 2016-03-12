'use strict';
const path = require('path');
const fs = require('fs');
const CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');

module.exports = {
  context: path.join(__dirname, 'frontend'),
  entry: findEntries(),
  output: {
    path: path.join(__dirname, 'js'),
    filename: '[name].bundle.js',
    chunkFilename: '[id].chunk.js'
  },
  plugins: [
    new CommonsChunkPlugin({
      filename: 'commons.js',
      name: 'commons'
    })
  ]
};

function findEntries () {
  const entryPoints = {};
  const p = path.join(__dirname, 'frontend');
  fs.readdirSync(p)
    .filter(f => !fs.statSync(path.join(p, f)).isDirectory())
    .forEach(f => entryPoints[f] = './' + f);
  return entryPoints;
}
