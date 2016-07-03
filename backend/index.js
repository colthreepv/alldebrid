'use strict';
const app = require('./app');

const listenPort = process.env.PORT || 8000;
const listenHost = process.env.HOST || '0.0.0.0';

function listenCallback () {
  const address = this.address();
  console.log(`Backend server started at http://${address.address}:${address.port}/`);
}

if (require.main === module) app.listen(listenPort, listenHost, listenCallback);
