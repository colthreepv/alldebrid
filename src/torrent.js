angular.module('ad')
.controller('TorrentController', function ($scope, $rootScope, $http, $timeout, hotkeys, $filter) {
  // initial values
  $scope.torrentStatus = 'working';
  $scope.retryCount = 0;
  $scope.torrents = [];
  $scope.cooldown = 30000;
  $scope.forever = true;
  $scope.selectAll = false;
  $scope.checkedTorrents = [];
  $scope.removing = false;

  $scope.orderByField = 'added_date';
  $scope.orderReversed = true;
  $scope.multiSelect = false;

  var torrentsDB = {};
  var cooldownTimeout;
  var lastChecked;

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

  function parseStatus (statusStr) {
    var s = statusStr.split(' ');
    if (s[1] === 'Downloading' || s[1] === 'Uploading') {
      return s[0];
    }
    if (statusStr === 'In Queue') {
      return 'queue';
    }
    return statusStr;
  }

  function parseSpeed (speedStr) {
    // when in queue, ad gives 0 as Number, not string.
    if (angular.isNumber(speedStr) || speedStr === '??') {
      return 0;
    }

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

    // when in queue, ad gives short-format dates
    if (d === null) {
      d = dateStr.match(/(\d{2})-(\d{2}):(\d{2})/);
      if (d.length) {
        newd.setDate(parseInt(d[1], 10));
        newd.setHours(parseInt(d[2], 10));
        newd.setMinutes(parseInt(d[3], 10));
      }
    } else { // all the rest
      if (d.length) {
        newd.setDate(parseInt(d[1], 10));
        newd.setMonth(parseInt(d[2], 10) - 1);
        newd.setHours(parseInt(d[3], 10));
        newd.setMinutes(parseInt(d[4], 10));
      }
    }

    return newd;
  }

  function parseLinks (linksStr) {
    var slicedStr = linksStr.slice(10, -97);
    return slicedStr.split(',;,').slice(0, -1);
  }

  function parseTorrents (data) {
    data.forEach(function (torrent, index, array) {
      var torrentID = parseInt(torrent[1], 10);
      var torrentDate = new Date();

      var newTorrent, lastIdx;

      // if exists, replace
      if (lastIdx = torrentsDB[torrentID], lastIdx !== undefined) {
        newTorrent = {
          id: torrentID,
          server: parseInt(torrent[2], 10),
          name: torrent[3].slice(31, -7),
          status: parseStatus(torrent[4]),
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
        newTorrent = {
          id: torrentID,
          server: parseInt(torrent[2], 10),
          name: torrent[3].slice(31, -7),
          status: parseStatus(torrent[4]),
          downloaded: torrent[5],
          size: torrent[6],
          seeder: parseInt(torrent[7], 10),
          speed: parseSpeed(torrent[8]),
          added_date: parseDate(torrent[9]),
          links: parseLinks(torrent[10])
        };
        $scope.torrents.push(newTorrent);

        torrentsDB[torrentID] = newTorrent;
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
      $scope.checkedTorrents.push($scope.torrents[i]);
    }
  };

  $scope.deselect = function () {
    $scope.selectAll = false;
    lastChecked = undefined;
    for (var i = 0; i < $scope.torrents.length; i++) {
      $scope.torrents[i].checked = false;
    }
    $scope.checkedTorrents.splice(0, Number.MAX_VALUE);
  };

  $scope.check = function (torrent) {
    var foundIdx, lastIdx, firstIdx;
    var orderedTorrents;

    if ($scope.multiSelect && angular.isDefined(lastChecked)) {
      orderedTorrents = $filter('orderBy')($scope.torrents, $scope.orderByField, $scope.orderReversed);
      lastIdx = orderedTorrents.indexOf(lastChecked);
      firstIdx = orderedTorrents.indexOf(torrent);

      // in case of bottom->up selection use this particular strategy to select
      if (lastIdx > firstIdx) {
        for (lastIdx--; firstIdx <= lastIdx; firstIdx++) {
          orderedTorrents[firstIdx].checked = !orderedTorrents[firstIdx].checked;
          if (orderedTorrents[firstIdx].checked) { // if it gets checked, add it to the list
            $scope.checkedTorrents.push(orderedTorrents[firstIdx]);
          } else { // otherwise remove it
            $scope.checkedTorrents.splice($scope.checkedTorrents.indexOf(orderedTorrents[firstIdx]), 1);
          }
        }
      } else {
        // otherwise
        for (lastIdx++, firstIdx++; lastIdx < firstIdx; lastIdx++) {
          orderedTorrents[lastIdx].checked = !orderedTorrents[lastIdx].checked;
          if (orderedTorrents[lastIdx].checked) { // if it gets checked, add it to the list
            $scope.checkedTorrents.push(orderedTorrents[lastIdx]);
          } else { // otherwise remove it
            $scope.checkedTorrents.splice($scope.checkedTorrents.indexOf(orderedTorrents[lastIdx]), 1);
          }
        }
      }

      lastChecked = torrent;
      return;
    }

    lastChecked = torrent;
    if (foundIdx = $scope.checkedTorrents.indexOf(torrent), foundIdx === -1) {
      torrent.checked = true;
      $scope.checkedTorrents.push(torrent);
    } else {
      torrent.checked = false;
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
      if (!delete torrentsDB[firstTorrent.id]) {
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

  $scope.generateLinks = function () {
    // torrentHash is a structure made this way:
    // {
    //   'torrent-name': ['link1', 'link2', 'link3'],
    //   'another-torrent-name': ['link1']
    // }
    var torrentHash = {};
    $scope.checkedTorrents.filter(function (torrent, idx) {
      return !!torrent.links.length;
    }).forEach(function (torrent, idx) {
      torrentHash[torrent.name] = angular.copy(torrent.links);
    });

    // send event only in case there's something to convert!
    if (!!Object.keys(torrentHash).length) {
      $scope.$emit('torrentLinks', torrentHash);
    }
  };

  // hold shift to multi-select
  hotkeys.bindTo($scope)
  .add({
    combo: 'shift',
    description: 'activate multi selection in table',
    action: 'keydown',
    callback: function (event, hotkey) {
      if ($scope.multiSelect) return;
      $scope.multiSelect = true;
    }
  })
  .add({
    combo: 'shift',
    description: 'dectivate multi selection in table',
    action: 'keyup',
    callback: function (event, hotkey) {
      $scope.multiSelect = false;
    }
  });

});