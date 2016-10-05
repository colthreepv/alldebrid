'use strict';
const Hapi = require('hapi');

const server = new Hapi.Server();
server.connection({
  host: process.env.HOST || '0.0.0.0',
  port: process.env.PORT || 8000,
});

server.start((err) => {

  if (err) throw err;
  console.log(`Server running at: ${server.info.uri}`);
});

/**
'use strict';
const app = require('./app');

const listenPort = process.env.PORT || 8000;
const listenHost = process.env.HOST || '0.0.0.0';

function listenCallback () {
  const address = this.address();
  console.log(`Backend server started at http://${address.address}:${address.port}/`);
}

if (require.main === module) app.listen(listenPort, listenHost, listenCallback);
**/
