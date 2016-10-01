'use strict';
const request = require('request');

module.exports = Promise.promisify(request);
