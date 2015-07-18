'use strict';

var bulk = require('bulk-require');
var modules = bulk(__dirname, ['./**/!(index).js']);

console.log(modules);

var AD = angular.module('ad', ['cfp.hotkeys', 'ui-router', 'templates']);
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
