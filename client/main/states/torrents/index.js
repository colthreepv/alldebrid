import jsonpipe, { flow } from 'jsonpipe';

function Controller ($state, $filter, torrentList) {
  // initial values
  this.db = torrentList;
  this.selectAll = false;
  this.checked = [];
  this.removing = false;

  this.orderByField = 'name';
  this.orderReversed = false;

  this.select = select.bind(this);
  function select () {
    this.selectAll = !this.selectAll;
    for (var i = 0; i < this.db.length; i++) {
      this.db[i].checked = this.selectAll;
      this.checked.push(this.db[i]);
    }
  }

  this.deselect = deselect.bind(this);
  function deselect () {
    this.selectAll = false;
    for (var i = 0; i < this.db.length; i++) {
      this.db[i].checked = false;
    }
    this.checked.splice(0, Number.MAX_VALUE);
  }

  this.check = check.bind(this);
  function check (torrent) {
    var foundIdx;

    if (foundIdx = this.checked.indexOf(torrent), foundIdx === -1) {
      torrent.checked = true;
      this.checked.push(torrent);
    } else {
      torrent.checked = false;
      this.checked.splice(foundIdx, 1);
    }
  }

  this.orderBy = orderBy.bind(this);
  function orderBy (column) {
    if (this.orderByField === column) this.orderReversed = !this.orderReversed;
    this.orderByField = column;
  }

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

  this.stream = stream.bind(this);
  function stream () {
    jsonpipe.flow('/api/torrents', {
      delimiter: '\n\n',
      success: data => console.log(data),
      error: errorMessage => console.log('error in flow', errorMessage),
      complete: statusText => console.log('flow complete', statusText)
    });
  }

}
export default {
  template: require('./index.html'),
  controller: Controller,
  controllerAs: '$ctrl'
};
