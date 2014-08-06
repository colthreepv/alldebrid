angular.module('ad')
.controller('AddController', function ($scope, $http, $timeout, transformRequestAsFormPost) {
  $scope.addingTorrents = false;
  $scope.magnetText = '';

  var magnetList = [];

  // addTorrents chains as many functions in this project, calls callback when done (no params)
  function addTorrents (callback) {
    if (!magnetList.length) return callback();

    var firstMagnet = magnetList[0];
    $http({
      method: 'POST',
      url: 'http://upload.alldebrid.com/uploadtorrent.php',
      transformRequest: transformRequestAsFormPost,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8' },
      data: {
        domain: 'http://www.alldebrid.com/torrent/',
        uid: '6ffc1edb3c62a69e75519233',
        magnet: firstMagnet
      }
    }).success(function (data, status, headers, config) {
      magnetList.splice(0, 1);
    }).error(function (data, status, headers, config) {
      $timeout(addTorrents.bind(null, callback), 5000);
      console.log('magnet add failure, retry in 5 secs');
    });
  }

  $scope.addTorrents = function () {
    magnetList = $scope.magnetText.split('\n').filter(function (m, idx) {
      return /magnet:\?xt=urn:(?:[\w\d]*)?:[a-z0-9]{20,50}/i.test(m);
    });

    if (!!magnetList.length) {
      $scope.addingTorrents = true;
      addTorrents(function () {
        $scope.addingTorrents = false;
      });
    }
  };


});