module.exports = ['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise(function ($injector) {
    var // injecting modules
      $state = $injector.get('$state'),
      user = $injector.get('user');

    user.isLogged().then(function () {
      $state.go('home.torrents');
    }, function () {
      $state.go('login');
    });
  });

  $stateProvider
  .state('login', {
    views: {
      '': {
        templateUrl: 'user/login.tpl.html',
        controller: 'loginCtrl as login',
      }
    }
  })
  .state('home', {
    abstract: true,
    views: {
      navbar: {
        controller: 'navbarCtrl as navbar',
        templateUrl: 'navbar/logged.tpl.html'
      },
      '': {
        template: '<ui-view/>'
      }
    }
  })
  .state('home.torrents', {
    views: {
      '': {
        templateUrl: 'torrent/torrent.tpl.html',
        controller: 'torrent'
      }
    }
  })
  .state('home.links', {
    params: {
      links: undefined
    },
    views: {
      '': {
        templateUrl: 'links/links.tpl.html',
        controller: 'linksCtrl as links'
      }
    }
  });

}];
