'use strict';
const ioc = require('../ioc');

module.exports = {
  login: ioc.create('api/login'),
  unlock: ioc.create('api/unlock'),
  logout: ioc.create('api/logout')
};
