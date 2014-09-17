angular.module('ad')
.controller('AddController', function ($scope, $rootScope, $http, $timeout, transformRequestAsFormPost) {
  $scope.addingTorrents = false;
  $scope.magnetText = '';

  var magnetList = [];

  // addMagnets chains as many functions in this project, calls callback when done (no params)
  function addMagnets (callback) {
    if (!magnetList.length) return callback();

    var firstMagnet = magnetList[0];
    $http({
      method: 'POST',
      url: 'http://upload.alldebrid.com/uploadtorrent.php',
      transformRequest: transformRequestAsFormPost,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8' },
      data: {
        domain: 'http://www.alldebrid.com/torrent/',
        uid: $rootScope.uid,
        magnet: firstMagnet
      }
    }).success(function (data, status, headers, config) {
      magnetList.splice(0, 1);
      addMagnets(callback);
    }).error(function (data, status, headers, config) {
      $timeout(addMagnets.bind(null, callback), 5000);
      console.log('magnet add failure, retry in 5 secs');
    });
  }

  $scope.addMagnets = function () {
    magnetList = $scope.magnetText.split('\n').filter(function (m, idx) {
      return /magnet:\?xt=urn:(?:[\w\d]*)?:[a-z0-9]{20,50}/i.test(m);
    });

    if (!!magnetList.length) {
      $scope.addingTorrents = true;
      addMagnets(function () {
        $scope.addingTorrents = false;
        $scope.magnetText = '';
        $rootScope.showTorrents = false;
        $scope.$emit('forceUpdateTorrents');
      });
    }
  };

  $scope.clearMagnets = function () {
    $scope.magnetText = '';
  };

});