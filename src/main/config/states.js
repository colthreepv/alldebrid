exports = module.exports = function ($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/torrents');

  function isLogged ($state, $q, user) {
    return user.isLogged().catch(function () {
      return $state.go('login');
    });
  }
  isLogged.$inject = ['$state', '$q', 'user'];

  $stateProvider
  .state('login', {
    url: '/login',
    views: {
      '': {
        templateUrl: 'user/login.tpl.html',
        controller: 'loginCtrl as login'
      }
    }
  })
  .state('home', {
    abstract: true,
    url: '',
    views: {
      navbar: {
        controller: 'navbarCtrl as navbar',
        templateUrl: 'navbar/logged.tpl.html'
      },
      '': {
        template: '<ui-view/>',
        resolve: {
          isLogged: isLogged
        }
      }
    }
  })
  .state('home.torrents', {
    url: '/torrents',
    views: {
      '': {
        templateUrl: 'torrent/torrent.tpl.html',
        controller: 'torrent'
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
  });

};

exports.$inject = ['$stateProvider', '$urlRouterProvider'];
