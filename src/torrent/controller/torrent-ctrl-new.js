exports = module.exports = function ($state, $filter, torrent, api, hotkeys) {
  var self = this;

  // initial values
  this.db = torrent.db;
  this.forever = true;
  this.selectAll = false;
  this.checked = [];
  this.removing = false;

  this.orderByField = 'added_date';
  this.orderReversed = true;
  this.multiSelect = false;

  var lastChecked;

  this.select = function () {
    self.selectAll = !self.selectAll;
    for (var i = 0; i < self.db.length; i++) {
      self.db[i].checked = self.selectAll;
      self.checked.push(self.db[i]);
    }
  };

  this.deselect = function () {
    self.selectAll = false;
    lastChecked = undefined;
    for (var i = 0; i < self.db.length; i++) {
      self.db[i].checked = false;
    }
    self.checked.splice(0, Number.MAX_VALUE);
  };

  this.check = function (torrent) {
    var foundIdx, lastIdx, firstIdx;
    var orderedTorrents;

    if (self.multiSelect && angular.isDefined(lastChecked)) {
      orderedTorrents = $filter('orderBy')(self.db, self.orderByField, self.orderReversed);
      lastIdx = orderedTorrents.indexOf(lastChecked);
      firstIdx = orderedTorrents.indexOf(torrent);

      // in case of bottom->up selection use this particular strategy to select
      if (lastIdx > firstIdx) {
        for (lastIdx--; firstIdx <= lastIdx; firstIdx++) {
          orderedTorrents[firstIdx].checked = !orderedTorrents[firstIdx].checked;
          if (orderedTorrents[firstIdx].checked) { // if it gets checked, add it to the list
            self.checked.push(orderedTorrents[firstIdx]);
          } else { // otherwise remove it
            self.checked.splice(self.checked.indexOf(orderedTorrents[firstIdx]), 1);
          }
        }
      } else {
        // otherwise
        for (lastIdx++, firstIdx++; lastIdx < firstIdx; lastIdx++) {
          orderedTorrents[lastIdx].checked = !orderedTorrents[lastIdx].checked;
          if (orderedTorrents[lastIdx].checked) { // if it gets checked, add it to the list
            self.checked.push(orderedTorrents[lastIdx]);
          } else { // otherwise remove it
            self.checked.splice(self.checked.indexOf(orderedTorrents[lastIdx]), 1);
          }
        }
      }

      lastChecked = torrent;
      return;
    }

    lastChecked = torrent;
    if (foundIdx = self.checked.indexOf(torrent), foundIdx === -1) {
      torrent.checked = true;
      self.checked.push(torrent);
    } else {
      torrent.checked = false;
      self.checked.splice(foundIdx, 1);
    }
  };

  this.removeChecked = function () {
    self.removing = true;
    torrent.remove(self.checked).then(function () {
      self.removing = false;
    });
  };

  this.generateLinks = function () {
    // torrentHash is a structure made this way:
    // {
    //   'torrent-name': ['link1', 'link2', 'link3'],
    //   'another-torrent-name': ['link1']
    // }

    var links = self.checked.reduce(function (arr, torrent) {
      return arr.concat(torrent.links);
    }, []);

    self.deselect();
    $state.go('home.unrestrict', { links: links });
  };

  // hold shift to multi-select
  hotkeys.add({
    combo: 'shift',
    description: 'activate multi selection in table',
    action: 'keydown',
    callback: function (event, hotkey) {
      if (self.multiSelect) return;
      self.multiSelect = true;
    }
  });
  hotkeys.add({
    combo: 'shift',
    description: 'dectivate multi selection in table',
    action: 'keyup',
    callback: function (event, hotkey) {
      self.multiSelect = false;
    }
  });

};
exports.$inject = ['$state', '$filter', 'torrent', 'adApi', 'hotkeys'];
