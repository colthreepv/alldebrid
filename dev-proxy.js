'use strict';
let // node modules
  express = require('express'),
  debug = require('debug'),
  httpProxy = require('http-proxy'),
  PrettyError = require('pretty-error'),
  serveStatic = require('serve-static');

let // node stdLib
  path = require('path');

let
  server = express(),
  pe = new PrettyError(),
  ad = httpProxy.createProxyServer({ changeOrigin: true }),
  dbgForward = debug('proxy:forward');

const baseDir = 'build';

ad.on('proxyRes', function (proxyRes, req, res, options) {
  dbgForward(proxyRes.headers);

  // location header fix www.alldebrid.com -> localhost:3000
  if (proxyRes.headers.location) {
    let location = proxyRes.headers.location;
    if (!location.startsWith('http://www.alldebrid.com')) {
      proxyRes.headers.location = 'http://localhost:3000/ad';
      return;
    }

    let partialUrl = location.split('http://www.alldebrid.com')[1];
    dbgForward('fixing header Location', partialUrl);
    proxyRes.headers.location = 'http://localhost:3000/ad' + partialUrl;
  }
});

ad.on('error', function errorHandler (err) {
  console.error(pe.render(err));
});

server.use(serveStatic(path.join(__dirname, baseDir)));

server.use('/ad', function (req, res) {
  dbgForward('Forwarding request:', req.url);
  ad.web(req, res, { target: 'https://www.alldebrid.com' });
});

server.use('/torrent', function (req, res) {
  dbgForward('Forwarding request:', req.url);
  ad.web(req, res, { target: 'https://upload.alldebrid.com/uploadtorrent.php' });
});

if (require.main === module) {
  server.set('port', process.env.PORT || 3000);
  server.set('hostname', process.env.HOSTNAME || '127.0.0.1');

  let listen = server.listen(server.get('port'), server.get('hostname'), function () {
    console.log('\x1b[36m%s\x1b[0m %s', 'Express server listening on:', 'http://' + listen.address().address + ':' + listen.address().port + '/');
  });
}

module.exports = server;
