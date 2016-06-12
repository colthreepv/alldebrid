'use strict';
const ioc = require('./ioc');
const app = ioc.create('app');

const listenPort = process.env.PORT || 8000;

function listenCallback () {
  const address = this.address();
  console.log(`Backend server started at http://${address.address}:${address.port}/`);
}

if (require.main === module) app.listen(listenPort, '127.0.0.1', listenCallback);
