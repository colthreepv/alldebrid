function Controller ($state, $filter, torrentList) {
  // initial values
  this.db = torrentList.first();
  torrentList.on('update', torrents => this.db = torrents);
  this.checked = [];
  this.removing = false;

  this.orderByField = 'name';
  this.orderReversed = false;

  // functions
  this.deselect = () => {
    this.selectAll = false;
    for (var i = 0; i < this.db.length; i++) {
      this.db[i].checked = false;
    }
    this.checked.splice(0, Number.MAX_VALUE);
  };

  this.orderBy = (column) => {
    if (this.orderByField === column) this.orderReversed = !this.orderReversed;
    this.orderByField = column;
  };

  this.removeChecked = removeChecked.bind(this);
  function removeChecked () {
    this.removing = true;
    torrent.remove(this.checked).then(function () {
      this.removing = false;
    });
  }

  this.generateLinks = generateLinks.bind(this);
  function generateLinks () {
    // torrentHash is a structure made this way:
    // {
    //   'torrent-name': ['link1', 'link2', 'link3'],
    //   'another-torrent-name': ['link1']
    // }

    var links = this.checked.reduce(function (arr, torrent) {
      return arr.concat(torrent.links);
    }, []);

    this.deselect();
    $state.go('home.unrestrict', { links: links });
  }

  this.check = (torrentId) => {
    var foundIdx;

    if (foundIdx = this.checked.indexOf(torrentId), foundIdx === -1) {
      this.checked.push(torrentId);
    } else {
      this.checked.splice(foundIdx, 1);
    }
  };
  this.isChecked = (torrentId) => this.checked.indexOf(torrentId) > -1;
}
export default {
  template: require('./index.html'),
  controller: Controller,
  controllerAs: '$ctrl'
};
