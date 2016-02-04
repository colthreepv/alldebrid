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
  console.log(this.address());
  console.log(`Server listening to ${ this.address() }`);
}

if (require.main === module) app.listen(8080, listenCallback);
