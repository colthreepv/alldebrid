exports = module.exports = function ($stateProvider, $urlRouterProvider, $locationProvider) {
  $urlRouterProvider.otherwise('/torrents');
  // hashbang
  $locationProvider.hashPrefix('!');

  var resolve = require('./_resolve');

  $stateProvider
  .state('login', {
    url: '/login',
    params: {
      goTo: undefined,
      params: undefined
    },
    views: {
      '': {
        templateUrl: 'user/login.tpl.html',
        controller: 'loginCtrl as login'
      },
      'footer': {
        controller: 'footerCtrl as footer',
        templateUrl: 'footer/footer.tpl.html'
      }
    }
  })
  .state('home', {
    abstract: true,
    url: '',
    resolve: {
      isLogged: resolve.isLogged
    },
    views: {
      navbar: {
        controller: 'navbarCtrl as navbar',
        templateUrl: 'navbar/logged.tpl.html'
      },
      '': {
        template: '<ui-view/>'
      },
      'footer': {
        controller: 'footerCtrl as footer',
        templateUrl: 'footer/footer.tpl.html'
      }
    }
  })
  .state('home.torrents', {
    url: '/torrents',
    views: {
      '': {
        templateUrl: 'torrent/torrent.tpl.html',
        controller: 'torrentCtrl as torrent',
        resolve: {
          startTorrents: resolve.startTorrents
        }
      }
    }
  })
  .state('home.unrestrict', {
    url: '/unrestrict',
    params: {
      links: undefined
    },
    views: {
      '': {
        templateUrl: 'unrestrict/from-torrent.tpl.html',
        controller: 'unrestrictCtrl as unr'
      }
    }
  })
  .state('home.add-external', {
    url: '/add/:magnet',
    resolve: {
      addMagnet: resolve.addMagnet
    }
  });

};

exports.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider'];
