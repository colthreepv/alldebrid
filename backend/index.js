'use strict';

var express = require('express');
var app = express();

app.post('/login');
app.post('/logout');

app.get('/torrent');
app.put('/torrent'); // add
app.post('/convert');

module.exports = app;
