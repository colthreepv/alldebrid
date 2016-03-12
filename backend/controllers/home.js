'use strict';

function home () {
  return [{
    method: 'render',
    args: ['home.j2']
  }];
}

module.exports = home;
