import './unrestrict.scss';
/* @ngInject */
function Controller ($stateParams, $q, $window, api, storage) {
  this.working = false;
  this.displayModes = ['href', 'text', 'aria2'];
  this.displayMode = storage.get('display-mode') || 'href';
  // this.requestedLinks = '';
  this.unrestrictedText = '';
  this.unrestricted = [];

  this.done = () => $window.history.back();

  this.changeDisplay = () => {
    storage.set('display-mode', this.displayMode);
  };

  this.unrestrict = (links) => {
    this.working = true;
    api.unrestrict(links)
    .then(response => {
      const apiData = response.data;

      apiData.forEach(file => this.unrestricted.push(file));

      this.unrestrictedText = apiData
        .filter(file => file.link)
        .map(file => file.link)
        .join('\n');

      this.listUrl = downloadList(this.unrestrictedText);
    })
    .finally(() => {
      this.working = false;
    });
  };

  if ($stateParams.links) this.unrestrict($stateParams.links);

  function downloadList (text) {
    const blobFile = new Blob([text], { type : 'text/plain' });
    const blobUrl = $window.URL.createObjectURL(blobFile);
    return blobUrl;
  }
}

export default {
  template: require('./index.html'),
  controller: Controller,
  controllerAs: '$ctrl'
};
