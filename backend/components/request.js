'use strict';
const Promise = require('bluebird');
const request = require('request');

module.exports = Promise.promisify(request);
