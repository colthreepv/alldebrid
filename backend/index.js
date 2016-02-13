'use strict';

var express = require('express');
var app = express();

app.post('/login');
app.post('/logout');

app.get('/api/torrent');
app.put('/api/torrent'); // add
app.post('/api/convert');

module.exports = app;

function listenCallback () {
  const address = this.address();
  console.log(`Server listening to http://${ address.address }:${ address.port }/`);
}

if (require.main === module) app.listen(8080, '127.0.0.1', listenCallback);
