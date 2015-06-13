'use strict';

var // angular modules
  angular = require('angular'),
  uiRouter = require('angular-ui-router');
require('angular-hotkeys'); // for side-effects

// module for templates
var ngify = angular.module('ngify', []);

var AD = angular.module('ad', ['cfp.hotkeys', uiRouter, ngify.name]);
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
