function Controller ($state, $filter, torrentList, api) {
  // initial values
  this.db = torrentList.first();
  torrentList.on('update', torrents => this.db = torrents);
  this.checked = [];
  this.removing = false;

  this.orderByField = 'name';
  this.orderReversed = false;

  // functions
  this.deselect = () => this.checked.splice(0, this.checked.length);
  this.orderBy = (column) => {
    if (this.orderByField === column) this.orderReversed = !this.orderReversed;
    this.orderByField = column;
  };

  this.removeChecked = () => {
    this.removing = true;
    api.removeTorrents(this.checked)
    .then(() => this.checked.splice(0, this.checked.length))
    .finally(() => this.removing = false);
  };

  this.generateLinks = generateLinks.bind(this);
  function generateLinks () {
    // torrentHash is a structure made this way:
    // {
    //   'torrent-name': ['link1', 'link2', 'link3'],
    //   'another-torrent-name': ['link1']
    // }

    const links = this.db.filter(torrent => this.checked.indexOf(torrent.id) !== -1)
    .map(torrent => torrent.links)
    .reduce((arr, links) => arr.concat(links), []);

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
