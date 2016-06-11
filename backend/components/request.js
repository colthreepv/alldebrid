'use strict';
const Promise = require('bluebird');
const request = require('request');

exports = module.exports = function () {
  return Promise.promisify(request);
};
