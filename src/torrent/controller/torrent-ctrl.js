exports = module.exports = function ($state, $filter, torrent) {
  var self = this;

  // initial values
  this.db = torrent.db;
  this.selectAll = false;
  this.checked = [];
  this.removing = false;

  this.orderByField = 'name';
  this.orderReversed = false;

  this.select = function () {
    self.selectAll = !self.selectAll;
    for (var i = 0; i < self.db.length; i++) {
      self.db[i].checked = self.selectAll;
      self.checked.push(self.db[i]);
    }
  };

  this.deselect = function () {
    self.selectAll = false;
    for (var i = 0; i < self.db.length; i++) {
      self.db[i].checked = false;
    }
    self.checked.splice(0, Number.MAX_VALUE);
  };

  this.check = function (torrent) {
    var foundIdx;

    if (foundIdx = self.checked.indexOf(torrent), foundIdx === -1) {
      torrent.checked = true;
      self.checked.push(torrent);
    } else {
      torrent.checked = false;
      self.checked.splice(foundIdx, 1);
    }
  };

  this.orderBy = function (column) {
    if (self.orderByField === column) self.orderReversed = !self.orderReversed;
    self.orderByField = column;
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

};
exports.$inject = ['$state', '$filter', 'torrent'];
