import './unrestrict.scss';
/* @ngInject */
function Controller ($stateParams, $q, $window, api, storage) {
  this.working = false;
  this.linksDisplay = storage.get('links-display') === 'text' ? true : false;
  // this.requestedLinks = '';
  this.unrestrictedText = '';
  this.unrestricted = [];

  this.done = () => $window.history.back();

  this.textMode = value => {
    if (value === undefined) return this.linksDisplay;
    this.linksDisplay = !this.linksDisplay;
    storage.set('links-display', this.linksDisplay ? 'text' : 'link');
  };

  this.unrestrict = (links) => {
    this.working = true;
    api.unrestrict(links)
    .then(response => {
      response.data.forEach(file => {
        this.unrestricted.push(file);
        if (file.link) this.unrestrictedText += `${file.link}\n`;
      });
    })
    .finally(() => this.working = false);
  };

  if ($stateParams.links) this.unrestrict($stateParams.links);

  function toSecure (unrestrictData) {
    if (unrestrictData && unrestrictData.link) unrestrictData.link = unrestrictData.link.replace('http:', 'https:');
    return unrestrictData;
  }
}

export default {
  template: require('./index.html'),
  controller: Controller,
  controllerAs: '$ctrl'
};
