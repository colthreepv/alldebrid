'use strict';

var
  angular = require('angular');

var AD = angular.module('ad', [require('angular-hotkeys')]);
AD.run(require('./run'));
