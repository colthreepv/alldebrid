angular.module('ad')
.controller('TorrentController', function ($scope, $rootScope, $http, $timeout) {
  // initial values
  $scope.torrentStatus = 'working';
  $scope.retryCount = 0;
  $scope.torrents = [];
  $scope.cooldown = 30000;
  $scope.forever = true;
  $scope.selectAll = false;
  $scope.checkedTorrents = [];
  $scope.removing = false;

  var torrentsDB = {};
  var cooldownTimeout;

  function fetchTorrents (callback) {
    $scope.torrentStatus = 'working';
    $http({
      method: 'GET',
      url: 'http://www.alldebrid.com/api/torrent.php',
      params: {
        json: true
      }
    })
    .success(function (data, status, headers, config) {
      $scope.torrentStatus = 'done';
      $scope.retryCount = 0;
      callback(data);
    })
    .error(function (data, status, headers, config) {
      $scope.torrentStatus = 'retrying';

      // retry connection
      $timeout(function () {
        $scope.retryCount += 1;
        console.log('retry torrent fetch...');
        fetchTorrents(callback);
      }, 5000 * Math.max(($scope.retryCount + 1), 10));
    });
  }

  function parseSpeed (speedStr) {
    var s = speedStr.match(/(\d*) (\w*)/);

    // shortcut to zero
    if (s.length && parseInt(s[1], 10) === 0) {
      return 0;
    }
    return speedStr;
  }

  function parseDate (dateStr) {
    var newd = new Date();
    var d = dateStr.match(/(\d{2})\/(\d{2})-(\d{2}):(\d{2})/);
    if (d.length) {
      newd.setDate(parseInt(d[1], 10));
      newd.setMonth(parseInt(d[2], 10) - 1);
      newd.setHours(parseInt(d[3], 10));
      newd.setMinutes(parseInt(d[4], 10));
    }
    return newd;
  }

  function parseLinks (linksStr) {
    var slicedStr = linksStr.slice(10, -97);
    return slicedStr.split(',;,').slice(0, -1);
  }

  function parseTorrents (data) {
    data.forEach(function (torrent, index, array) {
      var torrentID = parseInt(torrent[1], 10), lastIdx;
      var torrentDate = new Date();

      var newTorrent;

      // if exists, replace
      if (lastIdx = torrentsDB[torrentID], !!lastIdx) {
        newTorrent = {
          id: torrentID,
          server: parseInt(torrent[2], 10),
          name: torrent[3].slice(31, -7),
          status: torrent[4],
          downloaded: torrent[5],
          size: torrent[6],
          seeder: parseInt(torrent[7], 10),
          speed: parseSpeed(torrent[8]),
          added_date: parseDate(torrent[9]),
          links: parseLinks(torrent[10])
        };

        for (var attrName in $scope.torrents[lastIdx]) {
          // in case the links array differ in length
          if (attrName === 'links' && $scope.torrents[lastIdx][attrName].length !== newTorrent[attrName].length) {
            $scope.torrents[lastIdx][attrName] = newTorrent[attrName];
          }
          if (
            attrName !== '$$hashKey' &&
            attrName !== 'added_date' &&
            attrName !== 'checked' &&
            attrName !== 'links' &&
            $scope.torrents[lastIdx][attrName] !== newTorrent[attrName]) {
              $scope.torrents[lastIdx][attrName] = newTorrent[attrName];
          }
        }
      } else {
        // else add
        lastIdx = $scope.torrents.push({
          id: torrentID,
          server: parseInt(torrent[2], 10),
          name: torrent[3].slice(31, -7),
          status: torrent[4],
          downloaded: torrent[5],
          size: torrent[6],
          seeder: parseInt(torrent[7], 10),
          speed: parseSpeed(torrent[8]),
          added_date: parseDate(torrent[9]),
          links: parseLinks(torrent[10])
        });

        torrentsDB[torrentID] = lastIdx - 1;
      }
    });
    if ($scope.forever) {
      cooldownTimeout = $timeout(fetchTorrents.bind(null, parseTorrents), $scope.cooldown);
    }
  }

  // start forever loop
  $rootScope.$watch('loginStatus', function (newValue, oldValue) {
    if (newValue === oldValue) return;

    if (newValue === 'login') {
      fetchTorrents(parseTorrents);
    }
  });

  $scope.checkForever = function () {
    if (!$scope.forever) fetchTorrents(parseTorrents);
  };

  $scope.$watch('cooldown', function (newValue, oldValue) {
    if (newValue === oldValue) return;

    $timeout.cancel(cooldownTimeout);
    cooldownTimeout = $timeout(fetchTorrents.bind(null, parseTorrents), $scope.cooldown);
  });

  $scope.select = function () {
    $scope.selectAll = !$scope.selectAll;
    for (var i = 0; i < $scope.torrents.length; i++) {
      $scope.torrents[i].checked = $scope.selectAll;
    }
  };

  $scope.check = function (idx) {
    var foundIdx;
    if (foundIdx = $scope.checkedTorrents.indexOf($scope.torrents[idx]), foundIdx === -1) {
      $scope.checkedTorrents.push($scope.torrents[idx]);
    } else {
      $scope.checkedTorrents.splice(foundIdx, 1);
    }
  };

  // removeTorrents chains as many functions in this project, calls callback when done (no params)
  function removeTorrents (callback) {
    if (!$scope.checkedTorrents.length) return callback();

    var firstTorrent = $scope.checkedTorrents[0];
    $http({
      method: 'GET',
      url: 'http://www.alldebrid.com/torrent/',
      params: {
        action: 'remove',
        id: firstTorrent.id
      }
    }).success(function (data, status, headers, config) {
      var idx;
      // cleaning data structures
      if (idx = $scope.checkedTorrents.indexOf(firstTorrent), idx !== -1) {
        $scope.checkedTorrents.splice(idx, 1);
      } else { console.log('missing splice, why?'); }
      if (idx = $scope.torrents.indexOf(firstTorrent), idx !== -1) {
        $scope.torrents.splice(idx, 1);
      } else { console.log('missing splice, why?'); }
      if (idx = torrentsDB[firstTorrent.id], !delete torrentsDB[firstTorrent.id]) {
        console.log('delete on torrentsDB did not work');
      }
      // go again
      removeTorrents(callback);
    }).error(function (data, status, headers, config) {
      $timeout(removeTorrents.bind(null, callback), 5000);
    });
  }

  $scope.removeChecked = function () {
    $scope.removing = true;
    removeTorrents(function () {
      $scope.removing = false;
    });
  };

});