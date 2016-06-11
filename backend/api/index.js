'use strict';
const ioc = require('../ioc');



module.exports = {
  login: ioc.create('api/login'),
  // unlock: require('./unlock'),
  // logout: require('./logout')
};
