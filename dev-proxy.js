var httpProxy = require('http-proxy');
var ad = httpProxy.createProxyServer({ changeOrigin: true });

ad.on('proxyRes', function (proxyRes, req, res, options) {
  console.log(proxyRes.headers);
  // proxyRes.setHeader('X-Special-Proxy-Header', 'foobar');
});

var // node stdLib
  fs = require('fs'),
  path = require('path'),
  url = require('url');

var express = require('express');
var server = express();

const baseDir = 'build';
var dirs = ['fonts', 'libs', ''];

/**
 * This section creates a list of urls to be served manually
 * by this script.
 * The array itself is an URL form, ex: /style.css or /libs/angular.js
 */
var localFiles = ['/'];
dirs.forEach(function (d) {
  var dirListing = fs.readdirSync(path.join(__dirname, baseDir, d))
  .map(function (file) {
    return [d, file].join('/');
  });
  localFiles = localFiles.concat(dirListing);
});
localFiles = localFiles.map(function (file) {
  return (file[0] === '/') ? file : '/' + file;
});

server.use(function (req, res, next) {
  var parsedUrl = url.parse(req.url);
  var pathname = parsedUrl.pathname;
  if (localFiles.indexOf(pathname) === -1) return next();
  console.log('Serving', pathname, 'by hand.');
  res.sendFile(pathname, { root: path.join(__dirname, 'build') });
});

server.use(function (req, res) {
  console.log('Forwarding request:', req.url);
  ad.web(req, res, { target: 'http://www.alldebrid.com' });
});

server.listen(3000, '127.0.0.1', function () {
  console.log('Server listening to port 3000');
});
