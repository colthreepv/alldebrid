'use strict';

// non-commonjs requires for side-effects
require('angular/angular.js');
require('angular-hotkeys');
var // angular modules
  uiRouter = require('angular-ui-router');

var AD = angular.module('ad', ['cfp.hotkeys', uiRouter, 'templates']);
AD.run(require('./run'));
AD.config(require('./config'));
AD.filter('bytes', require('./filter/bytes'));
AD.controller('BodyController', require('./controller/body'));
AD.controller('AddController', require('./controller/add'));
AD.controller('LinksController', require('./controller/links'));
AD.controller('TorrentController', require('./controller/torrent'));
AD.factory('adLogin', require('./service/login'));
AD.factory('transformRequestAsFormPost', require('./service/transformReq'));
AD.factory('chromeStorage', require('./service/chromeStorage'));
AD.factory('uidFetcher', require('./service/uidFetcher'));
